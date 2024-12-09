const express = require('express');

const router = express.Router();

const { addSkill, updateSkill, deleteSkill, getSkillById, getSkillList } = require('../controllers/skills.js');

// add skill
router.route("/add").post(addSkill);

// update skill
router.route("/update").put(updateSkill);

// delete skill
router.route("/delete/:id").delete(deleteSkill);

// get skill by id
router.route("/get/:id").get(getSkillById);

// get skill list
router.route("/list").post(getSkillList);

module.exports = router;