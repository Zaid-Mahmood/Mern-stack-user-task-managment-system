import { Router } from "express";
import { registerUser, loginUser, logoutUser , generateLink , resetPassword} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/verifyJwt.middleware.js";
import { addUser , getAllUser , updateTask , deleteTask , searchTask} from "../controllers/loggedUser.controller.js";
const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/generate-link").post(generateLink);

router.route("/reset-password/:token").patch(resetPassword);

router.route("/add-user").post(addUser);

router.route("/get-all-tasks").get(verifyJwt , getAllUser )

router.route("/update-task").post(verifyJwt , updateTask )

router.route("/delete-task").post(verifyJwt , deleteTask )

router.route("/search-task").post(verifyJwt , searchTask )

export default router;