#On Tap

_Better than a whiteboard over the kegerator_

##Local Installation

1. Install and configure the tools you need. (Node, Mysql server, npm)/
2. Clone the repo
3. Run the `db-init/db-init.sql` script against your Mysql server
4. `npm i`
5. `npm run gulp`
6. `npm start`
7. Navigate to localhost:3000, or whichever port you specified in your env variables

##Docker Development
Docker and docker-compose files are provided and configured for development without needing to install MySQL locally.
1. Set up your `.env` file with BreweryDB key and any other custom settings
1. `docker-compose up`
1. (in a separate terminal) `npm run dev`

On creation a `mysql-data` directory is created and the init script is run.
To reinitialize the db, delete this directory as well as the `ontap_db` container then rerun docker-compose.
You can also connect direclty to MySQL running on localhost:3306 when docker-compose is running.

##Development
If you plan to make changes to the codebase, here are some helpful tips.

- Placing a file named `.env` in the root of the project will allow you to set env vars in bash syntax e.g. `PORT=3000`
- A [BreweryDB](http://www.brewerydb.com/) API key is required. Set it with an env var named `BREWERY_DB_KEY`
- You can auto-compile and auto-reload the brower on changes by running `npm run dev`. This will require that you run the server in another terminal
- The gulp file has many helpful methods that can be called separately depending on the changes you made. 
For example, you can recompile the server without building the entire project by using `npm run gulp -- compile_node`


##Contribution
1. Open an issue with your bug/feature request. Other maintainers may have helpful insight in to your request.
2. Fork the repo.
3. Open a pull request against the `dev` branch. That is the home for latest code, whereas master will hold release versions.
4. Your PR must pass our status checks and a review from at least one contributor

