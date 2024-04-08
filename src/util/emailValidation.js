import * as Yup from "yup";

const emailValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export default emailValidationSchema;
