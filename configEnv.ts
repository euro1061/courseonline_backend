import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.default') });

if(new Date().getTimezoneOffset() !== -420) {
    throw new Error('Timezone is not correct');
}