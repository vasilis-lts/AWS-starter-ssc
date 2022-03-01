import { useEffect, useState } from "react";
import { Alert, Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { ReactComponent as BackArrowIcon } from '../assets/icons/back.svg';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg';

import { useLocation, useNavigate } from "react-router-dom";
import { getData, postData } from "../helpers/requests";
import { Alerts } from "../interfaces/general";

export default function NewCampaign(props) {
  const state = useLocation();
  const navigate = useNavigate();
  const [FormValues, setFormValues] = useState<Record<string, any>>({
    companyId: 1,
    name: "",
    period: "",
    isFrozen: false
  });
  const [CompanyOptions, setCompanyOptions] = useState<any>([]);
  const [ShowToastMessage, setShowToastMessage] = useState<boolean>(false);
  const [ToastMessage, setToastMessage] = useState<string>("");
  const [ToastType, setToastType] = useState<Alerts>('error');
  const [DataLoading, setDataLoading] = useState<boolean>(false);

  useEffect(() => {
    let _state: any = state;
    if (_state?.Companies) {
      createCompanyOptions(_state?.Companies);
    } else {
      getCompanies();
    }
    // eslint-disable-next-line
  }, [state]);

  function createCompanyOptions(companies) {
    let companyOptions: any[] = [];
    companies.forEach(c => {
      if (c.name && c.companyId) {
        companyOptions.push({
          key: c.companyId,
          value: c.companyId,
          label: c.name
        })
      }
    });
    setCompanyOptions(companyOptions);
  }

  async function getCompanies() {
    setDataLoading(true);
    const { res, status } = await getData('/Company');
    setDataLoading(false);

    if (status === 200) {
      createCompanyOptions(res);
    } else {
      setToastType("error");
      setToastMessage('Error getting companies');
      setShowToastMessage(true);
    }
  }

  function handleChange(event) {
    const formValues = { ...FormValues };
    formValues[event.target.name] = event.target.value;
    setFormValues(formValues);
  }

  function handleCheckboxChange(event) {
    const formValues = { ...FormValues };
    formValues[event.target.name] = !formValues[event.target.name];
    setFormValues(formValues);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setDataLoading(true);
    const { res, status } = await postData(`/Company/${FormValues.companyId}/Campaign`, FormValues);
    setDataLoading(false);
    console.log(status);
    if (status === 200) {
      console.log(res);
      setToastType("success");
      setToastMessage('Campaign added successfully!');
      setShowToastMessage(true);
      navigate(`/company/${FormValues.companyId}/campaign/${res.campaignId}/details`)
    } else {
      console.log(res);
      setToastType("error");
      setToastMessage('Error adding campaign');
      setShowToastMessage(true);
    }

  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToastMessage(false);
  };

  return (
    <div id="addNewCampaign" className="content screen-with-header flex-center-x">
      <Box className="flex-col ">
        <div className="flex-center-y">
          <div onClick={() => navigate("/campaigns")}><BackArrowIcon style={{ width: 25, height: 25, marginRight: 10, cursor: "pointer" }} /></div>
          <Typography variant="h4" className="text-primary-color">Create new campaign</Typography>
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <Box key={"companyId"} className="flex-col form-group">
              <label htmlFor={"companyId"} className='label' >Select Company</label>
              <Select
                id={"companyId"}
                name={"companyId"}
                className="text-center"
                value={FormValues.companyId}
                onChange={handleChange}
              >
                {CompanyOptions.map(opt => {
                  return <MenuItem key={opt.key} value={opt.value}>{opt.label}</MenuItem>
                })}

              </Select>
            </Box>

            <Box key={"name"} className="flex-col form-group">
              <label htmlFor={"name"} className='label' >Campaign Name*</label>
              <TextField
                fullWidth
                id={"name"}
                name={"name"}
                type={"text"}
                required
                value={FormValues.name}
                onChange={handleChange}
              />
            </Box>

            <Box key={"period"} className="flex-col form-group">
              <label htmlFor={"period"} className='label' >Period*</label>
              <TextField
                fullWidth
                id={"period"}
                name={"period"}
                type={"text"}
                required
                value={FormValues.period}
                onChange={handleChange}
              />
            </Box>

            <Box className="flex-col form-group">
              <FormGroup>
                <FormControlLabel
                  id={'isFrozen'}
                  name={'isFrozen'}
                  control={<Checkbox checked={FormValues.isFrozen} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                  onChange={(event) => handleCheckboxChange(event)}
                  label="Is Frozen?" />
              </FormGroup>
            </Box>

            <div className="form-actions flex-reverse">
              <Button
                color="success"
                variant="contained"
                type="submit"
                size="large"
                disableElevation
                disabled={DataLoading}
                id={"NCFormButton"}
              >
                <UploadIcon style={{ color: "white", marginRight: 3, fontSize: 18 }} />
                Save
              </Button>
              <Button onClick={() => navigate("/campaigns")} color="primary" variant="outlined" type="button" size="large">
                Cancel
              </Button>
            </div>
            {DataLoading && <span>Loading...</span>}
          </form>
        </div>
      </Box>

      {ShowToastMessage ?
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={ShowToastMessage}
          autoHideDuration={60000}
          style={{ maxWidth: 500 }}
          onClose={handleClose}
          key={'topright'}>
          <Alert onClose={handleClose} severity={ToastType} sx={{ width: '100%' }}>{ToastMessage}</Alert>
        </Snackbar>
        : null}
    </div>
  )
}