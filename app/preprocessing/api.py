import sys
import pandas as pd
import numpy as np
import requests
import io
import re
import datetime
import math
import itertools

DATA_PATH = "data/"
MASTER_PATH = DATA_PATH + "master.txt"
urls = {'master': 'http://data.gdeltproject.org/gdeltv2/masterfilelist.txt'}


# Takes a date from the master file format as a string and convert it to a datetime format
def parse_date(string):
    return datetime.datetime.strptime(str(re.findall('/([0-9]*)\.', string)[0]), "%Y%m%d%H%M%S")


# Cleans the masterfilelist by droping the empty lines and parsing the dates
def clean_master(master):
    # Drops nan columns
    master = master.dropna(how='any')

    # Create date columns
    master = master.assign(date=master.url.apply(parse_date))

    # Creates a column with the type of the csv file
    master = master.assign(col_type=master.url.apply(lambda url: url.split('.')[-3]))

    return master


# Gets the masterfilelist and cleans its content
def fetch_master():
    master = pd.read_csv(MASTER_PATH, sep=" ", header=None, names=['size', 'code', 'url'])
    return clean_master(master)


# Adds a columns to the master dataframe to easily detect the urls containing the exports, the mentions and the gkg data
def split_master(master):
    splitted = {}
    elements = [['export', 'export'], ['mentions', 'mentions'], ['gkg', 'gkg']]
    for element in elements:
        splitted[element[1]] = master[master.col_type == element[0]]
    return splitted


# Gets subset of data from the master given a time constraint
def sample_master(master, date_start, date_end):
    return master[(master.date >= date_start) & (master.date <= date_end)]


# @TODO comment
def get_data_columns(event, mentions, gkg):
    col_ex = open(DATA_PATH + event, "r").readlines()[0].rstrip('\n').split(" ")
    col_men = open(DATA_PATH + mentions, "r").readlines()[0].rstrip('\n').split(" ")
    col_gkg = open(DATA_PATH + gkg, "r").readlines()[0].rstrip('\n').split(" ")
    return col_ex, col_men, col_gkg


# Cleans the dataframe content by droping the empty lines
def clean_dataframe(data):
    data = data.dropna()
    return data


# Fetches one type of dataframe given the original columns and the wanted columns
def fetch(url, col, col_use):
    data = pd.read_csv(url, sep='\t', names=col, usecols=col_use)
    data = clean_dataframe(data)
    return data


def fetch_all(master, data_type, col, col_use, date_start=None, date_end=None, verbose=True):
    if date_start is None:
        date_start = datetime.datetime(2000, 1, 1)
    if date_end is None:
        date_end = datetime.datetime.now()
    sampled = sample_master(master, date_start, date_end)
    splitted = split_master(sampled)
    all_datas = []
    for datas_url in splitted[data_type]['url']:
        if verbose:
            print(datas_url)
        try:
            datas = fetch(datas_url, col, col_use)
            all_datas.append(datas)
        except:
            if verbose:
                print("Error downloading url %s" % datas_url)
            pass
    return pd.concat(all_datas)


def get_all(master, type, d1, d2, verbose=False):

    # @TODO refactor this shit
    col_export, col_mentions, col_gkg = get_data_columns(
        "event_table_name",
        "mentions_table_name",
        "gkg_table_name"
    )
    col_use_export, col_use_mentions, col_use_gkg = get_data_columns(
        "event_table_usefull_name",
        "mentions_table_usefull_name",
        "gkg_table_usefull_name"
    )

    return fetch_all(master, type, col_export, col_use_export, d1, d2, verbose)


# TODO: 1. DROP DUPLICATES IN MENTIONS - 2. MERGE WITH EXPORT - 3. DROP DUPLICATES IN EXPORT
#       4. CHOOSE THE RIGHT COLUMNS


# test
master = fetch_master()
d1 = datetime.datetime.strptime(sys.argv[1], "%Y-%m-%d %H:%M:%S")
d2 = datetime.datetime.strptime(sys.argv[2], "%Y-%m-%d %H:%M:%S")
d = get_all(master, sys.argv[3], d1, d2, False)
print(d.to_json(orient='records'))

