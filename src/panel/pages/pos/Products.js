import React, {useEffect, useState} from 'react';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import Controls from '../../components/controls/Controls';
import useTable from '../../components/features/useTable';
import { Search } from "@material-ui/icons";
import { getAllProducts } from '../../components/services/stockSlice';

const useStyles = makeStyles(theme => ({
  pageContent: {
      margin: theme.spacing(1),
      padding: theme.spacing(1)
  },
  searchInput: {
      width: '75%'
  },
  newButton: {
      position: 'absolute',
      right: '10px'
  }
}))

const headCells = [
  { id: 'id', label: '#' },
  { id: 'category', label: 'Category' },
  { id: 'make', label: 'Brand (make)' },
  { id: 'product', label: 'Product (model)' },
  { id: 'description', label: 'Description' },
  { id: 'keepingUnit', label: 'SKU' },
  { id: 'price', label: 'Price ($)' },
  { id: 'quantity', label: 'Quantity' },
]

export default function Products() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });

  useEffect(() => {
    getProductData();
  }, []);

const getProductData = async () => {
    try {
        let response = await getAllProducts();
        setRecords(response.data);
    } catch (error) {
        console.log(error);
    }
};

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells,filterFn);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value === "")
                return items;
            else
                return items.filter(x => x.product.toLowerCase().includes(target.value))
        }
    })
  }
  return (
    <>
      <Paper className={classes.pageContent}>
      <Toolbar>
        <Controls.Input
          label="Search product"
          className={classes.searchInput}
          InputProps={{
          startAdornment: (<InputAdornment position="start">
            <Search />
          </InputAdornment>)
          }}
          onChange={handleSearch}
        />
      </Toolbar>
      <TblContainer>
        <TblHead />
        <TableBody>
        {
          recordsAfterPagingAndSorting().map(stock =>
          (
            <TableRow key={stock.id}>
              <TableCell>{stock.id}</TableCell>
              <TableCell>{stock.brand.category.category}</TableCell>
              <TableCell>{stock.brand.make}</TableCell>
              <TableCell>{stock.product}</TableCell>
              <TableCell>{stock.description}</TableCell>
              <TableCell>{stock.keepingUnit}</TableCell>
              <TableCell>{stock.price}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
            </TableRow>
          ))
        }
        </TableBody>
      </TblContainer>
      <TblPagination />
      </Paper>
    </>
  )
}
