/**
 * Will run preload jobs after the document is ready, but before anything is started
 */
export class Preload {

    /**
     * Add a job to run before starting the app
     *
     * @param job Job to run (must return a Promise)
     */
    static addJob(job) {

        if (Preload.preloaded)
            throw new Error("Cannot add job after preload is complete");

        Preload.jobs.push(job);
    }

    /**
     * Run all jobs
     *
     * @return {Promise<any[]>}
     */
    static async run() {

        if (Preload.preloaded)
            throw new Error("Preload is already done");

        const result = await Promise.all(Preload.jobs.map(job => job()));

        Preload.preloaded = true;

        return result;
    }
}


Preload.jobs = [];
Preload.preloaded = false;
