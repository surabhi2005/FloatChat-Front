// src/api/ragApi.jsx

// RunJobParams type as JSDoc
/**
 * @typedef {Object} RunJobParams
 * @property {string} query
 * @property {string=} year
 * @property {string[]=} months
 * @property {number=} top_k
 */

/**
 * @typedef {Object} JobMeta
 * @property {string} job_id
 * @property {"queued"|"running"|"done"|"error"} status
 * @property {RunJobParams} params
 * @property {string=} result_path
 * @property {string=} error
 */

/**
 * @typedef {Object} JobResult
 * @property {string} job_id
 * @property {string} status
 * @property {string=} answer
 * @property {*} structured
 * @property {*} canvas
 * @property {string=} numeric_sample_csv
 * @property {string=} output_json
 * @property {string=} audit_path
 */

// enqueue a job
export async function runQuery(params) {
    const res = await fetch("http://127.0.0.1:8000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    return res.json();
}

// poll job status until done
export async function getJobResult(job_id) {
    let res;
    while (true) {
        const r = await fetch(`http://127.0.0.1:8000/api/result/${job_id}`);
        res = await r.json();
        if (res.status === "done" || res.status === "error") break;
        await new Promise((r) => setTimeout(r, 1000)); // 1s poll
    }
    return res;
}
