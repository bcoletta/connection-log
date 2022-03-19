const fs = require('fs');
const logFileLocation = process.argv[2] || './connection-log.txt';

const checkConnection = () => {
  require('dns').resolve('www.google.com', err => {
    if (err) {
      checkIfDisconnected();
    } else {
      checkForReconnection();
    }
  });
}

const writeToLog = (msg) => {
  let log = fs.readFileSync(logFileLocation, { encoding: 'utf-8' });
  const newMessage = `${msg} - ${new Date().toDateString()} @ ${new Date().toTimeString()}\n`
  const output = `${log}${newMessage}`;
  fs.writeFileSync(logFileLocation, output);
  console.log(newMessage);
}

const getLastLogLine = () => {
  let log = fs.readFileSync(logFileLocation, { encoding: 'utf-8' });
  return log.trim().split('\n').pop();
}

const checkIfDisconnected = () => {
  const lastLine = getLastLogLine();
  if (!lastLine.startsWith('Disconnected')) writeToLog('Disconnected');
}

const checkForReconnection = () => {
  const lastLine = getLastLogLine();
  if (lastLine.startsWith('Disconnected')) writeToLog('Reconnected');
}

writeToLog('Log started');
setInterval(checkConnection, 60000);