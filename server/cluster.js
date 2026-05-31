const cluster = require('cluster');
// console.log(cluster);

const numCPUs = require('os').availableParallelism();
// console.log(numCPUs);
const process = require('process');
// console.log(process);
const http = require('http');

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }   
    cluster.on('exit', (a,b,c) => {
        console.log(`Worker ${a.process.pid} died`);
    });
}
else {
    http.createServer((req, res) => {
       
        res.end('Hello World\n');
    }).listen(8000);
    console.log(`Worker ${process.pid} started`);
}


