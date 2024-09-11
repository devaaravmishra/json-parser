import { App } from '@/app';
import { IndexRoute } from '@/routes/index.route';
import { ParserRoute } from '@/routes/parser.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new IndexRoute(), new ParserRoute()]);

app.listen();
