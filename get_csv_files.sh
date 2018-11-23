#!/bin/bash
#set -x -e

# ------------------------------------------------
# get_csv_file.sh 
# Version: 20.11.2018
# Author: Virginie Piskin
# ------------------------------------------------

SOURCE=http://data.gdeltproject.org/gdeltv2/masterfilelist.txt
TARGET=/home/mobaxterm/EPFL1819/data_vizualisation/project/data

# Print usage by default
if [[ $# -lt 1 || $1 == "h" || $1 == "-help" || $1 == "--help" ]] ; then
  cat << USAGETEXT
	get_csv_file: Script to get a subset of csv files from the internet. It 
		      gets a number of csv files spaced accordingly to the parameter
		      to this script. It returns a text file which contains the paths
		      to the wanted csv files.
    	usage: 
      		get_csv_file.sh [options]
   	options:
		-y <str>         : Number of years
		-m <str>         : Number of months
		-d <str>         : Number of days
		-h <str>         : Number of hours
		-N <str>         : Number of csv per wanted sampling	

USAGETEXT
  exit 0
fi 

# Read the options
while getopts "y:m:d:h:N:" opt; do
	case $opt in
	
        	y)
			year=$OPTARG
			echo "$year"
			;;
		m)
			month=$OPTARG
			echo "$month"
        		;;
		d)
			day=$OPTARG
			echo "$day"
			;;
		h)
			hour=$OPTARG
			echo "$hour"
			;;
		N)
                        N=$OPTARG
                        echo "$N"
                        ;;

		\?) echo "Unknown option $OPTARG"; exit 2;;

		:) echo "Option $OPTARG requires an argument"; exit 2;;
	esac
done

master_file=masterfilelist.txt

wget $SOURCE -O $TARGET/masterfilelist.txt

min_year=2015 ; max_year=2018
min_month=1 ; max_month=12
min_day=1 ; max_day=31
min_hour=0 ; max_hour=23
min_min=0 ; max_min=60

year_list=$(python -c "print(range($min_year, $min_year + $year, 1))")
month_list=$(python -c "print(range($min_month, $max_month +1, $max_month/$month))")
day_list=$(python -c "print(range($min_day, $max_day + 1, $max_day/$day))")
hour_list=$(python -c "print(range($min_hour, $max_hour, $max_hour/$hour))")
min_list=$(python -c "print(range($min_min, $max_min, $max_min/$N))")

echo "$year_list \n $month_list \n $day_list \n $hour_list \n $min_list"

for year in $year_list ; do
	y=$(echo $year | sed -e 's/[][,]//g')
	for month in $month_list ; do
		m=$(echo $month | sed -e 's/[][,]//g')
		count=$(echo -n $m | wc -c)
		if [ $count == 1 ] ; then 
			m=$(echo "0$m")
		fi
		for day in $day_list ; do 
			d=$(echo $day | sed -e 's/[][,]//g')
			count=$(echo -n $d | wc -c)
			if [ $count == 1 ] ; then
				d=$(echo "0$d")
			fi
			for hour in $hour_list ; do 
				h=$(echo $hour | sed -e 's/[][,]//g')
                        	count=$(echo -n $h | wc -c)
                        	if [ $count == 1 ] ; then
                                	h=$(echo "0$h")
                        	fi
				for min in $min_list ; do 
					m=$(echo $min | sed -e 's/[][,]//g')
	                                count=$(echo -n $m | wc -c)
        	                        if [ $count == 1 ] ; then
                	                        m=$(echo "0$m")
                        	        fi
                                	echo "in $y$m$d$h$m"
					cat $TARGET | awk '{print $8}' | grep $y$m$d$h$m | grep export
					exp=$(cat $TARGET | awk '{print $3}' | grep $y$m$d$h$m | grep export)
					gkg=$(cat $TARGET | awk '{print $3}' | grep $y$m$d$h$m | grep gkg)
					men=$(cat $TARGET | awk '{print $3}' | grep $y$m$d$h$m | grep mentions)
					if [[ exp != '' ]] && [[ gkg != '' ]] && [[ men != '' ]] ; then
						#wget $exp -P $TARGET
						#wget $gkg -P $TARGET
						#wget $gkg -P $TARGET
						echo $exp >> export.txt
						echo $gkg >> gkg.txt
						echo $men >> mentions.txt
					fi 
				done
			done
		done

	done
done

#hadoop fs -ls /datasets/gdeltv2/ | awk '{print $8}'
