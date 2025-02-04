const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Form = require("../models/Forms");
const FormResponse = require("../models/FormResponse");

router.post("/", auth, async (req, res) => {
  const { title, fields } = req.body;
  try {
    const newForm = new Form({
      title,
      fields,
      author: req.user.id,
    });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/:formId", async (req, res) => {
    const { formId } = req.params;
    try {
      const form = await Form.findById(formId);
      if (!form) return res.status(404).json({ msg: "Form not found" });
      res.json(form);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });

router.post("/:formId/response", async (req, res) => {
  const { formId } = req.params;
  const { responses } = req.body;
  try {
    const form = await Form.findById(formId);
    if (!form)
      return res.status(404).json({ msg: "Form not found" });
    const newResponse = new FormResponse({
      form: formId,
      responses,
    });
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:formId/responses", auth, async (req, res) => {
  const { formId } = req.params;
  try {
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ msg: "Form not found" });
    if (form.author.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });
    const responses = await FormResponse.find({ form: formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;