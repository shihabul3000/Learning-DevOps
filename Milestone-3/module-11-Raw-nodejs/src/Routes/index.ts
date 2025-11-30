
import { readUsers, writeUsers } from "../helpers/fileDB"
import addRoute from "../helpers/route-handler"
import parseBody from "../Pars/parse-body"
import sendJson from "../send-json"

addRoute('GET', '/', (req, res) => {

  sendJson(res, 200, {
    message: "Hellw im trying to new methods heheh :):",
    path: req.url,

  })
})

addRoute("GET", "/api", (req, res) => {

  sendJson(res, 200, {
    message: "this is an /API route enjoy",
    path: req.url,

  })

})

addRoute("POST", "/api/users", async (req, res) => {
  const body = await parseBody(req);

  const users = readUsers();

  const newuser = {
    //id : Date.now(),
    ...body,

  };

  users?.push(newuser);
  writeUsers(users);

  sendJson(res, 201, { success: true, data: body });
});


addRoute("PUT", "/api/users/:id", async (req, res) => {
  const { id } = (req as any).params
  const body = await parseBody(req);

  const users = readUsers()

  const index = users.findIndex((user: any) => user.id == id);

  if (index == -1) {
    sendJson(res, 404, {
      success: false,
      message: "user not found",
    })
  }

  users[index] = {
    ...users[index], ...body,
  };

  writeUsers(users);

  sendJson(res, 202, { success: true, message: `id ${id} user updated`, data: users[index] })

})


// -- Delte Method --------------------------------------------

addRoute("DELETE", "/api/users/:id", async (req, res) => {
  const { id } = (req as any).params

  const users = readUsers()

  const index = users.findIndex((user: any) => user.id == id);

  if (index == -1) {
    sendJson(res, 404, {
      success: false,
      message: "user not found",
    })
    return;
  }

  const deletedUser = users[index];
  users.splice(index, 1);

  writeUsers(users);

  sendJson(res, 200, {
    success: true,
    message: `User with id ${id} deleted successfully`,
    data: deletedUser
  })
})