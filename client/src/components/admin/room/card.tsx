import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import {
  Checkbox,
  Paper,
  Typography,
  Toolbar,
  TableSortLabel,
  TableRow,
  TablePagination,
  TableHead,
  TableContainer,
  TableCell,
  Box,
  Table,
  TableBody,
  IconButton,
  Button,
  Tooltip,
  FormControlLabel,
  Switch,
  InputBase,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { MenuCustom, FilterCustom } from "../common/menu";

import { visuallyHidden } from "@mui/utils";
import { SelectFilter } from "../common/common";

import { DataRoom } from "../../../interfaces";
import axios from "axios";
import environment from "../../../config";
import { useToasts } from "react-toast-notifications";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
  disableSort?: boolean;
}

const headCellsRoom: HeadCell<DataRoom>[] = [
  {
    id: "id",
    numeric: false,
    disableSort: true,
    disablePadding: true,
    label: "id",
  },
  {
    id: "room_no",
    numeric: false,
    disableSort: false,
    disablePadding: true,
    label: "room_no",
  },
  {
    id: "description",
    numeric: false,
    disableSort: true,
    disablePadding: true,
    label: "description",
  },
  {
    id: "rent",
    numeric: false,
    disableSort: true,
    disablePadding: true,
    label: "rent",
  },
  {
    id: "images",
    numeric: false,
    disableSort: true,
    disablePadding: true,
    label: "images",
  },
  {
    id: "status",
    numeric: false,
    disableSort: true,
    disablePadding: true,
    label: "status",
  },
];

interface EnhancedTableProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell<T>[];
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function EnhancedTableHead(props: EnhancedTableProps<DataRoom>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler =
    (property: keyof DataRoom) => (event: React.MouseEvent<unknown>) => {
      // (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {props.headCells.map((headCell: HeadCell<DataRoom>, index: any) => (
          <TableCell
            key={index}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {!headCell.disableSort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
        <TableCell key={"function"} align={"center"} padding={"normal"}>
          Function
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectOptions: any[];
  selectOptionsLeft: any[];
  selectOptions1: any[];
  selectOptions2?: any[];
  title: string;
  emailVerified?: boolean;
  selected: any;
}

const EnhancedTableToolbarCustom = (props: EnhancedTableToolbarProps) => {
  const { numSelected, selected } = props;
  const { addToast } = useToasts();

  const handleDelete = async () => {
    try {
      // code there
      const items = selected.map(async (item: any) => {
        axios({
          url: `${environment.api}rooms/${item}`,
          method: "DELETE",
          withCredentials: true,
        })
          .then(({ data }) => {
            // Handle success
          })
          .catch((err) => {
            console.log(err);
            // Handle error
            addToast("Error!!", {
              appearance: "error",
              autoDismiss: true,
            });
          });
        return item;
      });
      Promise.all(items)
        .then(async () => {
          addToast("Oke!", {
            appearance: "success",
            autoDismiss: true,
          });
        })
        .catch((error) => {
          addToast("Error!!", {
            appearance: "error",
            autoDismiss: true,
          });
          console.log(error.message);
        });
    } catch (error) {
      // Handle error
      addToast("Error!!", {
        appearance: "error",
        autoDismiss: true,
      });
      console.log(error);
    }
  };

  return (
    <div>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Typography sx={{ flex: "1 1 100%" }} id="tableTitle" component="div">
          <div className="flex items-center space-x-3 py-3">
            <SelectFilter
              values={props.selectOptionsLeft}
              initValue={""}
              name="Bulk Action"
            />
            <Button variant="contained" disabled={true}>
              Apply
            </Button>
            {numSelected > 0 ? (
              <div className="flex items-center space-x-3">
                <Typography
                  sx={{ flex: "1 1 100%" }}
                  color="inherit"
                  variant="subtitle1"
                  component="div"
                >
                  {numSelected} selected
                </Typography>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={async () => {
                      await handleDelete();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ) : null}
          </div>
        </Typography>
        <div className="flex items-center space-x-3">
          <div className="border border-l-0 border-t-0 border-b-0">
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </div>
          <div>
            <FilterCustom {...props} />
          </div>
        </div>
      </Toolbar>
    </div>
  );
};

export const RoomTable = ({ rows }: { rows: DataRoom[] }) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof DataRoom>("id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DataRoom
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbarCustom
          selected={selected}
          numSelected={selected.length}
          selectOptionsLeft={[{ value: "delete", text: "Delete Rooms" }]}
          selectOptions={[
            {
              key: "Add Room",
              text: "Add Room",
              path: `/admin/rooms/add-room`,
            },
            {
              key: "Import Room",
              text: "Import Room",
              path: `/admin/rooms/import-rooms`,
            },
          ]}
          selectOptions1={[
            { value: "all", text: "Any Status" },
            { value: "active", text: "Active" },
            { value: "deactive", text: "Deactive" },
          ]}
          title={"Filter Rooms"}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              headCells={headCellsRoom}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(`${row.id}`);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, `${row.id}`)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{row.room_no}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{row.rent}</TableCell>
                      <TableCell align="center">
                        {JSON.parse(row.images).length
                          ? JSON.parse(row.images || "[]").map((el: any) => {
                              return (
                                <CardMedia
                                  component="img"
                                  height="100"
                                  sx={{ maxWidth: 100 }}
                                  image={`${el}`}
                                  alt="green iguana"
                                />
                              );
                            })
                          : ""}
                      </TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                      <TableCell align="center">
                        <MenuCustom
                          optionsOrder={[
                            {
                              key: "Edit Room",
                              text: "Edit Room",
                              path: `/admin/rooms/edit-room/${row.id}`,
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
};

export const CardRoom = (props: any) => {
  return (
    <Card sx={{ minWidth: 0, height: "100%" }}>
      <CardContent>
        <RoomTable rows={props.values} />
      </CardContent>
    </Card>
  );
};
