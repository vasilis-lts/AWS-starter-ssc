import { useEffect, useState } from "react";
import { Alert, Box, Button, Snackbar, Tab, Tabs, Typography } from "@mui/material";
import { ReactComponent as BackArrowIcon } from '../assets/icons/back.svg';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Campaign } from "../models/campaign";
import MainTable from "../components/MainTable";
import { Alerts } from "../interfaces/general";
import { getData, postData } from "../helpers/requests";
import { Storage } from "aws-amplify";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const fileColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    // width: 330,
    Cell: ({ row }) => {
      return <div className="table-cell">{row.original.name}</div>
    }
  },
  {
    Header: 'Shipments uploaded',
    accessor: 'noOfLines',
    // width: 330,
    Cell: ({ row }) => {
      return <div className="table-cell">{row.original.noOfLines}</div>
    }
  },
];

const shipmentProcessColumns = [
  {
    Header: 'Count',
    accessor: 'count',
    Cell: ({ row }) => {
      return <div className="table-cell">{row.original.count}</div>
    }
  },
  {
    Header: 'Validation Result',
    accessor: 'validationResult',
    Cell: ({ row }) => {
      return <div className="table-cell">{row.original.validationResult}</div>
    }
  },
  {
    Header: 'Logical Ids',
    accessor: 'someLogicalIds',
    Cell: ({ row }) => {
      return <div className="table-cell">{row.original.someLogicalIds.join(", ")}</div>
    }
  },
];

export default function CampaignDetails() {
  const { state } = useLocation();
  const [value, setValue] = useState(0);
  const { companyId, campaignId } = useParams();
  const [Campaign, setCampaign] = useState<Campaign | null>(null);
  const [CompanyName, setCompanyName] = useState<string>("");
  const [FileImports, setFileImports] = useState<null | any[]>(null);
  const [CampaignColumns, setCampaignColumns] = useState<any>(null);
  const [ShowToastMessage, setShowToastMessage] = useState<boolean>(false);
  const [ToastMessage, setToastMessage] = useState<string>("");
  const [ToastType, setToastType] = useState<Alerts>('error');
  const [DataLoading, setDataLoading] = useState<boolean>(false);
  const [ShipmentDataLoading, setShipmentDataLoading] = useState<boolean>(false);
  const [FilesLoading, setFilesLoading] = useState<boolean>(false);
  const [ShipmentProcessResult, setShipmentProcessResult] = useState<any[] | null>(null);

  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (state) {
      const _state: any = state
      setCompanyName(_state.CompanyName);
      setCampaign(_state.Campaign);
    } else {
      // getCampaignById
      // getCompanyById
      getCampaignByCompanyIdAndCampaignId(companyId, campaignId);
    }

    createColumns();
    // eslint-disable-next-line
  }, [state]);

  useEffect(() => {
    if (Campaign) {
      getImportFiles();
    }
    // eslint-disable-next-line
  }, [Campaign]);

  async function getImportFiles() {
    setFilesLoading(true);
    const { res, status } = await getData(`/Company/${companyId}/Campaign/${campaignId}/FileImport`);
    setFilesLoading(false);

    if (status === 200) {
      console.log(res);
      setFileImports(res);
    } else {
      setToastType("error");
      setToastMessage('Error getting file imports');
      setShowToastMessage(true);
    }
  }

  useEffect(() => {

  }, [FileImports]);

  async function getCampaignByCompanyIdAndCampaignId(companyId, campaignId) {
    setDataLoading(true);
    const { res, status } = await getData(`/Company/${companyId}`);
    setDataLoading(false);

    if (status === 200) {
      setCompanyName(res.name);
      const campaign = res.campaigns.find(c => c.campaignId === parseInt(campaignId, 10));
      if (campaign) {
        setCampaign(campaign);
      } else {
        setToastType("error");
        setToastMessage(`Campaign with id:${campaignId} not found`);
        setShowToastMessage(true);
      }

    } else {
      setToastType("error");
      setToastMessage('Error getting company');
      setShowToastMessage(true);
    }
  }

  function createColumns() {

    const columns = [
      {
        Header: 'Campaign Id',
        accessor: 'campaignId',
        // width: 330,
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.campaignId}</div>
        }
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.name}</div>
        }
      },
      {
        Header: '# Shipments',
        accessor: 'shipmentTotalsTotalCount',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.shipmentTotals ? row.original.shipmentTotals.totalCount : 0}</div>
        }
      },
      {
        Header: '# Import Validation Errors',
        accessor: 'shipmentTotalsImportValidationErrors',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.shipmentTotals ? row.original.shipmentTotals.totalValidationErrors : 0}</div>
        }
      },
      {
        Header: '# Lane Determination Errors',
        accessor: 'shipmentTotalsLaneDeterminationErrors',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.shipmentTotals ? row.original.shipmentTotals.totalLaneDeterminationErrors : 0}</div>
        }
      },

    ];
    setCampaignColumns(columns);
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToastMessage(false);
  };

  async function handleFile(e) {

    for (var i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      await readFileAsync(file);
    }

    console.log('done uploading');
    getImportFiles();

    // clear file input
    const fileInput: any = document.getElementById('files');
    if (fileInput) {
      fileInput.value = null;
    }
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = async () => {
        if (reader.result) {
          const result: string = reader.result.toString();
          const lines = result.split("\n").length;

          if (campaignId) {

            const raw = {
              "campaignId": parseInt(campaignId, 10),
              "name": file.name,
              "importDate": "2022-02-28T10:29:37.920Z",
              "noOfLines": lines
            }

            const { res, status } = await postData(`/Company/${companyId}/campaign/${campaignId}/FileImport`, raw);
            console.log(res, status)

            if (status === 200) {
              // s3 upload
              try {
                const res: any = await Storage.put(`files/${file.name}`, file);
                console.log(res)
              } catch (err) {
                console.log(err);
              }
            }

            resolve(reader.result);
          }
        }
      };

      reader.onerror = reject;

      reader.readAsBinaryString(file);
    })
  }

  async function handleProcess() {
    if (FileImports?.length) {
      getShipmentProcessResult();
    } else {
      setToastType('error');
      setToastMessage('Upload some files first!');
      setShowToastMessage(true);
    }
  }

  async function getShipmentProcessResult() {
    setShipmentDataLoading(true);
    const { res, status } = await getData(`/Company/${companyId}/campaign/${campaignId}/ShipmentProcessResult`);
    setShipmentDataLoading(false);

    if (status === 200) {
      console.log(res);
      setShipmentProcessResult(res);
    } else {
      setToastType("error");
      setToastMessage('Error getting Shipment Processes');
      setShowToastMessage(true);
    }
  }

  return (
    <div id="campaignDetails" className="content screen-with-header">
      {Campaign &&
        <Box className="flex-col">

          <div id="campaignDetailsTitle" className="screen-title">

            <Box className="flex-col">
              <div className="flex-center-y">
                <div onClick={() => navigate("/campaigns")}><BackArrowIcon style={{ width: 25, height: 25, marginRight: 10, cursor: "pointer" }} /></div>
                <Typography variant="h4" className="text-primary-color">Campaign Details</Typography>
              </div>
              {DataLoading && <span>Loading...</span>}

              {!DataLoading &&
                <div style={{ paddingTop: 10, paddingLeft: 35 }}>
                  {CompanyName &&
                    <div className="flex-center-y" style={{ marginTop: 10 }}>
                      <Typography variant="subtitle1" className="text-primary-color"><b>Company:</b> {CompanyName}</Typography>
                    </div>
                  }
                  <div className="flex-center-y">
                    <Typography variant="subtitle1" className="text-primary-color"><b>Campaign Status:</b> Open</Typography>
                  </div>
                </div>
              }
            </Box>

            {!DataLoading &&
              <Box className="flex-col details-actions">
                <Button
                  variant='contained'
                  component='label'
                >Upload CSV
                  <input type="file" accept=".csv" id="files" name="files" onChange={handleFile} hidden multiple />
                </Button>
                <Button
                  variant='contained'
                  size="small"
                  onClick={() => handleProcess()}
                >Process Data</Button>
              </Box>}
          </div>

          {!DataLoading &&
            <Box sx={{ width: '100%', marginTop: 5 }}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#3FC2D4"
                    }
                  }}
                >
                  <Tab label="Overview" {...a11yProps(0)} />
                  <Tab label="File Import" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>

                {CampaignColumns && Campaign ?
                  <div style={{ marginTop: 10 }}>
                    <Typography variant="h5" className="text-primary-color">Campaign overview</Typography>
                    <MainTable
                      data={[Campaign]}
                      columns={CampaignColumns}
                    />
                  </div>
                  : null}


                {ShipmentProcessResult?.length ?
                  <div style={{ marginTop: 20 }}>
                    <Typography variant="h5" className="text-primary-color">Import results</Typography>
                    {ShipmentDataLoading && <span>Loading...</span>}
                    <MainTable
                      data={ShipmentProcessResult}
                      columns={shipmentProcessColumns}
                    />
                  </div>
                  : null}


              </TabPanel>
              <TabPanel value={value} index={1}>
                {FilesLoading && <span>Loading...</span>}
                {FileImports?.length ?
                  <div style={{ marginTop: 10 }}>
                    <Typography variant="h5" className="text-primary-color">Files</Typography>
                    <MainTable
                      data={FileImports}
                      columns={fileColumns}
                    />
                  </div>
                  :
                  null
                }
                {FileImports?.length === 0 && <span>No files found...</span>}

              </TabPanel>
            </Box>}

        </Box>
      }

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
    </div >
  )
}