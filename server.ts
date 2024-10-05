import { app } from './src/app';
import { config } from './src/config/config';

function startServer() {
    const port = config.port || 8000;
    app.listen(port, () => {
        console.log(`app is listening at http://localhost:${port}`);
    })
}

startServer();