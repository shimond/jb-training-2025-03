import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button, 
  Slider, 
  Select, 
  Input, 
  Dialog, 
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Checkbox,
  MenuItem,
  Typography
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';



interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Comment {
  id: number;
  productId: number;
  text: string;
  timestamp: Date;
}

type SortField = 'id' | 'name' | 'price' | 'category';
type SortDirection = 'asc' | 'desc';

const StyledContainer = styled('div')`
  padding: 20px;
  
  .filters {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f8f8;
    border-radius: 5px;
  }

  .action-buttons {
    margin: 10px 0;
    display: flex;
    gap: 10px;
  }

  .selected-row {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .sort-header {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .table-container {
    margin-top: 20px;
  }
`;

const StyledTableCell = styled(TableCell)`
  &.header-cell {
    background-color: #f5f5f5;
    font-weight: bold;
  }
`;

export const ProductManagement: React.FC = () => {
  // ... (previous state declarations)

  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sorting function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'price') {
      return (a[sortField] - b[sortField]) * direction;
    }
    return a[sortField].toString().localeCompare(b[sortField].toString()) * direction;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
  };

  return (
    <StyledContainer>
      {/* ... (previous filters and action buttons) */}

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell className="header-cell" padding="checkbox">
                <Checkbox
                  checked={selectedProducts.length === products.length}
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </StyledTableCell>
              
              <StyledTableCell 
                className="header-cell"
                onClick={() => handleSort('id')}
              >
                <div className="sort-header">
                  ID <SortIcon field="id" />
                </div>
              </StyledTableCell>

              <StyledTableCell 
                className="header-cell"
                onClick={() => handleSort('name')}
              >
                <div className="sort-header">
                  Name <SortIcon field="name" />
                </div>
              </StyledTableCell>

              <StyledTableCell 
                className="header-cell"
                onClick={() => handleSort('price')}
              >
                <div className="sort-header">
                  Price <SortIcon field="price" />
                </div>
              </StyledTableCell>

              <StyledTableCell 
                className="header-cell"
                onClick={() => handleSort('category')}
              >
                <div className="sort-header">
                  Category <SortIcon field="category" />
                </div>
              </StyledTableCell>

              <StyledTableCell className="header-cell" align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow 
                key={product.id}
                className={selectedProducts.includes(product.id) ? 'selected-row' : ''}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary" 
                    size="small"
                    onClick={() => {/* Handle edit */}}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    size="small"
                    onClick={() => {/* Handle delete */}}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton 
                    color="info" 
                    size="small"
                    onClick={() => handleOpenComments(product.id)}
                  >
                    <CommentIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {sortedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ... (previous dialogs and snackbar) */}
    </StyledContainer>
  );
};