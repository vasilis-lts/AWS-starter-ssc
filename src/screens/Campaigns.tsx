import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import MainTable from "../components/MainTable";
import { Campaign } from "../models/campaign";
import { ReactComponent as AddScreenIcon } from '../assets/icons/add.svg';
import { useNavigate } from "react-router-dom";
import { getData } from "../helpers/requests";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Alerts } from "../interfaces/general";
import { Company } from "../models/company";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Campaigns() {
  let navigate = useNavigate();
  const [Columns, setColumns] = useState<any>(null);
  const [Campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [Companies, setCompanies] = useState<Company[]>([]);
  const [ShowToastMessage, setShowToastMessage] = useState<boolean>(false);
  const [ToastMessage, setToastMessage] = useState<string>("");
  const [ToastType, setToastType] = useState<Alerts>('error');
  const [DataLoading, setDataLoading] = useState<boolean>(false);

  useEffect(() => {
    getCompanies();
    // eslint-disable-next-line
  }, []);

  async function getCompanies() {
    setDataLoading(true);
    const { res, status } = await getData('/Company');
    setDataLoading(false);

    if (status === 200) {
      extractCampaigns(res);
      setCompanies(res);
    } else {
      setToastType("error");
      setToastMessage('Error getting campaigns');
      setShowToastMessage(true);
      setCampaigns([]);
    }
  }

  function extractCampaigns(companies) {
    const campaignsTotal: any[] = [];

    companies.forEach(company => {
      if (company?.campaigns?.length) {
        campaignsTotal.push(...company.campaigns);
      }
    });

    setCampaigns(campaignsTotal);
    createColumns(companies);
  }

  function createColumns(companies) {
    const columns = [
      {
        Header: 'Company Id',
        accessor: 'companyId',
        // width: 330,
        Cell: ({ row }) => {
          return <div className="table-cell">{companies.find(comp => comp.companyId === row.original.companyId).name}</div>
        }
      },
      // {
      //   Header: 'Campaign Id',
      //   accessor: 'campaignId',
      //   // width: 330,
      //   Cell: ({ row }) => {
      //     return <div className="table-cell">{row.original.campaignId}</div>
      //   },
      //   hide: true
      // },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.name}</div>
        }
      },
      {
        Header: '# of Shipments',
        accessor: 'shipmentTotalsTotalCount',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.shipmentTotals ? row.original.shipmentTotals.totalCount : 0}</div>
        }
      },
      {
        Header: '# of Import Validation Errors',
        accessor: 'shipmentTotalsImportValidationErrors',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.shipmentTotals ? row.original.shipmentTotals.totalValidationErrors : 0}</div>
        }
      },
      {
        Header: '# of Lane Determination Errors',
        accessor: 'shipmentTotalsLaneDeterminationErrors',
        Cell: ({ row }) => {
          return <div className="table-cell">{row.original.shipmentTotals ? row.original.shipmentTotals.totalLaneDeterminationErrors : 0}</div>
        }
      },
      {
        Header: '',
        accessor: 'details',
        Cell: ({ row }) => {
          return <div className="table-cell">
            <Button
              color="warning"
              size="small"
              variant="text"
              onClick={() => {
                navigate(`/company/${row.original.companyId}/campaign/${row.original.campaignId}/details`,
                  {
                    state: {
                      Campaign: row.original,
                      CompanyName: companies.find(comp => comp.companyId === row.original.companyId).name
                    }
                  })
              }}>View campaign</Button>
          </div>
        }
      },
    ];
    setColumns(columns);
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToastMessage(false);
  };

  return (
    <div id="campaigns" className="content screen-with-header">
      <div className="flex-jcsb screen-title">
        <Typography variant="h4" className="text-primary-color">Campaigns</Typography>
        <Box>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate("/add-new-campaign", { state: { Companies } })}
          ><AddScreenIcon style={{ marginRight: 5 }} />New campaign</Button>
        </Box>
      </div>

      {/* TABLE */}
      {Columns &&
        <div style={{ marginTop: 100, marginLeft: '1%' }} className="table">
          <Typography variant="subtitle1">Campaigns Overview</Typography>
          <MainTable data={Campaigns} columns={Columns} />
        </div>
      }

      {ShowToastMessage ?
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={ShowToastMessage}
          autoHideDuration={6000}
          style={{ maxWidth: 500 }}
          onClose={handleClose}
          key={'topright'}>
          <Alert onClose={handleClose} severity={ToastType} sx={{ width: '100%' }}>{ToastMessage}</Alert>
        </Snackbar>
        : null}

      {DataLoading && <span>Loading...</span>}
    </div>
  )
}