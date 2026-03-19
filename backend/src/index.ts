import app from './app';
import ENV from './constants/enviroment.constant';

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});
