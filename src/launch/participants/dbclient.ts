const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

//#region Shutdown handlers
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

interface IExitHandlerOptions {
    cleanup?: boolean;
    exit?: boolean;
}

function exitHandler(options: IExitHandlerOptions) {
    if (options.cleanup) console.log('Cleaning up active DB connections');
    client.end();

    if (options.exit) process.exit();
}
//#endregion
client.connect();

module.exports = client;

interface IFieldInfo {
    name: string;
    dataTypeId: string;
};
export interface IQueryResult {
    rows: Array<any>;
    fields: Array<IFieldInfo>;
    rowCount: number,
    command: string;
};