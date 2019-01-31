const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running, no of cpus ${numCPUs}`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    // Replace the dead worker,
    // we're not sentimental
    cluster.fork();
  });
} else {
  const express = require('express');
  const app = express();
  app.listen(3000, () => {
    console.log(`Server listen on 3000 by ${process.pid} worker`);
  });

  app.get('/', (req, res) => {
    for (let count = 0; count < 100; count++) {
      console.log(process.pid, '   ',count);
    }
    res.json({
      data: 'yupppp',
      workerid: process.pid
    })
    // setTimeout(() => {
    //   res.json({
    //     data: 'yupppp',
    //     workerid: process.pid
    //   })
    // }, 10000)
  })
}