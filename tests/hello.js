import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) { // gera um report em html
    return {
      "summary.html": htmlReport(data),
    };
}

// script que roda com 10 usuarios durante 30 segundos
// k6 run --vus 10 --duration 30s hello,js

export default function () {
    const res = http.get('http://localhost:3333');

    check(res, {
        'status should be 200': (r) => r.status === 200
    })

    sleep(1);
}