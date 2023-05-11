const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();

const format = require("date-fns/format");

const isMatch = require("date-fns/isMatch");

var isValid = require("date-fns/isValid");

app.use(express.json());

const dbPath = path.join(_dirname, "todoApplication.bd");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename:dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Several Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuary.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return (
};

const hasCategoryAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndPriorityProperties = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

const hasSearchProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

const convertDataIntoResponseObject = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    category: dbObject.category,
    priority: dbObject.priority,
    status: dbObject.status,
    dueDate: dbObject.due_Date,
  };
};

//API - 1

app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status, category } = request.query;

  let data = null;
  let getTodosQuery = "";

  //WE ARE USING SWITCH CASES FOR BECAUSE OF DIFFERENT SCENARIOS

  switch (true) {
    //SCENARIO -1 --- HAS ONLY STATUS
    case hasSearchProperty(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        getTodosQuery = `
            SELECT * FROM todo WHERE status = '${status}';`;

        data = await db.all(getTodosQuery);
        response.send(
          data.map((eachItem) => convertDataIntoResponseObject(eachItem))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    //SCENARIO -2 HAS ONLY PRIORITY

    case hasPriorityProperty(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        getTodosQuery = `
            SELECT * FROM todo WHERE priority = '${priority}';`;

        data = await db.all(getTodosQuery);
        response.send(
          data.map((eachItem) => convertDataIntoResponseObject(eachItem))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
       break;

    //SCENARIO -3 HAS BOTH PRIORITY AND STATUS

    case hasPriorityAndStatusProperties(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `SELECT * FROM todo
                   WHERE priority = '${priority}'
                   AND status = '${status}';`;

          data = await db.all(getTodosQuery);
          response.send(
            data.map((eachItem) => convertDataIntoResponseObject(eachItem))
          );
        } else {
        response.status(400);
        response.send("Invalid Todo Status");
        }
       } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;

    // SCENARIO - 4 HAS ONLY SEARCH_Q

    case hasStatusProperty(request.query):
      getTodosQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;

      data = await db.all(getTodosQuery);
      response.send(
        data.map((eachItem) => convertDataIntoResponseObject(eachItem))
      );

      break;

    // SCENARIO - 5 HAS BOTH CATEGORY AND STATUS

    case hasCategoryAndStatusProperties(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE" ||
        ) {
          getTodosQuery = `SELECT * FROM todo
          WHERE category = '${category}'
          AND status = '${status}';`;

          data = await db.all(getTodosQuery);
      response.send(
        data.map((eachItem) => convertDataIntoResponseObject(eachItem))
      );
        }
        } else {
        response.status(400);
        response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

      //SCENARIO -6 HAS ONLY CATEGORY

     case hasCategoryProperty(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        getTodosQuery = `
            SELECT * FROM todo WHERE category = '${category}';`;

         data = await db.all(getTodosQuery);
      response.send(
        data.map((eachItem) => convertDataIntoResponseObject(eachItem))
      );
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    //SCENARIO -7 HAS BOTH CATEGORY AND PRIORITY

    case hasCategoryAndPriorityProperties(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
            priority === "HIGH" ||
            priority === "MEDIUM" ||
            priority === "LOW"
        ) {
            getTodosQuery = `SELECT * FROM todo
            WHERE category = '${category}'
            AND priority = '${priority}';`;

          data = await db.all(getTodosQuery);
          response.send(
            data.map((eachItem) => convertDataIntoResponseObject(eachItem))
          );
        }
     } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;
    //DEFAULT
    default:
      getTodosQuery = `SELECT * FROM todo;`;
      data = await db.all(getTodosQuery);
      response.send(
        data.map((eachItem) => convertDataIntoResponseObject(eachItem))
      );
  }
});

//API -2

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const getTodosQuery =`SELECT * FROM todo
    WHERE id = ${todoId};`;

  const dbResponse = await db.get(getTodosQuery);
  response.send(convertDataIntoResponseObject(dbResponse));
});

//API - 3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;

  if(isMatch(date, "yyyy-MM-dd")) {
    const newDate = format(new Date(date), "yyyy-MM-dd");

    
  }





