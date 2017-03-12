import * as express from "express";
import {GET, Path, PathParam, Server} from "typescript-rest";


@Path("/hello")
class HelloService {
    @Path(":name")
    @GET
    public sayHello( @PathParam("name") name: string): string {
        return "Hello " + name;
    }
}

const app: express.Application = express();
Server.buildServices(app);

app.listen(3000, function() {
    console.log("Rest Server listening on port 3000!");
});