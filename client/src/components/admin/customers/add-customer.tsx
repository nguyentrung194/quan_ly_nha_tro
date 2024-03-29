import {
  Card,
  CardContent,
  Box,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  CardMedia,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import * as React from "react";
import { useFormik } from "formik";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import environment from "../../../config";
import { storage } from "../../../hooks/use-firebase";

export const AddCustomer = () => {
  const { addToast } = useToasts();
  const [state, setState] = React.useState<{ selections: string[] }>({
    selections: [],
  });

  function handleCheckboxChange(key: string) {
    let sel = state.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }

    setState({
      selections: sel,
    });
    formik.setFieldValue("roles", sel);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
      room_id: "",
    },
    onSubmit: async (values) => {
      try {
        formik.setSubmitting(true);
        // code there
        axios({
          url: `${environment.api}users`,
          method: "POST",
          data: {
            ...values,
          },
        })
          .then(({ data }) => {
            // Handle success
            addToast(`Success`, {
              appearance: "success",
              autoDismiss: true,
            });
          })
          .catch((err) => {
            console.log(err);
            // Handle error
            addToast("Error!!", {
              appearance: "error",
              autoDismiss: true,
            });
          });
        formik.setSubmitting(false);
      } catch (error) {
        // Handle error
        addToast("Error!!", {
          appearance: "error",
          autoDismiss: true,
        });
        console.log(error);
        formik.setSubmitting(false);
      }
    },
  });
  return (
    <div className="bg-gray-200/40 -mt-4 pt-4 min-h-screen">
      <div className="flex justify-between items-center px-6 pt-6">
        <div className="">
          <h3 className="text-3xl leading-none font-bold font-serif">
            Add Customer
          </h3>
        </div>
      </div>
      <div className="p-6">
        <Card sx={{ minWidth: 0, height: "100%" }}>
          <CardContent>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1 },
              }}
              noValidate
              autoComplete="off"
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-3 gap-3"
            >
              <div className="col-span-1 row-span-2 flex items-start flex-col">
                {formik.values.image ? (
                  <CardMedia
                    component="img"
                    height="100"
                    sx={{ maxWidth: 100 }}
                    image={`${formik.values.image}`}
                    alt="green iguana"
                  />
                ) : (
                  ""
                )}
                <div className="flex items-center">
                  <label className="h-full cursor-pointer border px-3 py-1.5 flex items-center justify-center w-full text-center hover:bg-slate-100 rou custom-file-upload">
                    <input
                      aria-label="File browser"
                      className="hidden"
                      name="image"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        console.log(storage);
                        formik.setSubmitting(true);
                        const uploadFiles = Array.from(
                          e.target.files as FileList
                        ).map(async (file: File) => {
                          const storageRef = storage.ref();
                          const ref = storageRef.child(
                            `users/profile/${file.name}`
                          );
                          const metadata = {
                            size: file.size,
                            contentType: file.type,
                            name: file.name,
                          };
                          await ref.put(file, metadata);
                          const assetUrl = await ref.getDownloadURL();
                          formik.setSubmitting(false);
                          return { ...metadata, assetUrl };
                        });
                        console.log(uploadFiles);
                        Promise.all(uploadFiles)
                          .then(async (result) => {
                            formik.setFieldValue("image", result[0].assetUrl);
                          })
                          .catch((error) => {
                            console.log(error.message);
                          });
                      }}
                    />
                    Upload Photo
                  </label>
                </div>
              </div>
              <FormControl variant="standard" className="col-span-1">
                <TextField
                  id="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  label="Name"
                  name="name"
                  required
                />
              </FormControl>
              <FormControl variant="standard" className="col-span-1">
                <TextField
                  id="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  label="Email"
                  name="email"
                  type="email"
                  required
                />
              </FormControl>
              <FormControl variant="standard" className="col-span-1">
                <TextField
                  id="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  label="phone"
                  name="phone"
                  required
                />
              </FormControl>
              <FormControl variant="standard" className="col-span-1">
                <TextField
                  id="room_id"
                  value={formik.values.room_id}
                  onChange={formik.handleChange}
                  label="room id"
                  name="room_id"
                />
              </FormControl>
              <Button type="submit" variant="contained">
                Add Customer
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
