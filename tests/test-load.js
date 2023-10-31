import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from './libs/uuid.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) { // gera um report em html
    return {
      "summary.html": htmlReport(data),
    };
}

// comando que roda com 10 usuarios durante 30 segundos
// --vus (Quantidade de usuarios)
// --duration (Duracao dos testes)
// k6 run --vus 10 --duration 30s hello,js

// constante que seta as opcoes de teste, no precisando passar via CLI
export const options = {
    stage: [
        {duration: '1m', target: 100}, // 1 min subindo 100 usuarios
        {duration: '2m', target: 100}, // 2 min mantendo os 100 usuarios
        {duration: '1m', target: 0} // 1 min dimiuindo os usuarios ate zerar
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], //95% das req devem responder em ate 2s
        http_req_failed: ['rate<0.01'] // Somente 1% das req podem falhar
    }
}

export default function () {
    const url = 'http://localhost:3333/signup'

    const payload = JSON.stringify(
        { email: `${uuid.v4().substring(24)}@qa.qacademy.com.br`, password: 'pwd123' }
    )

    const headers = {
        'headers' : {
            'Content-Type' : 'application/json'
        }
    }

    const res = http.post(url, payload, headers);

    check(res, {
        'status should be 200': (r) => r.status === 201
    })

    sleep(1);
}