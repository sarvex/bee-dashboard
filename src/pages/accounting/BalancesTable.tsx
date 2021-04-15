import type { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper } from '@material-ui/core'
import CashoutModal from '../../components/CashoutModal'

import { fromBZZbaseUnit } from '../../utils'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

interface Props {
  accounting: Record<string, Accounting> | null
}

function BalancesTable({ accounting }: Props): ReactElement | null {
  if (!accounting) return null

  console.log(accounting) // eslint-disable-line
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Peer</TableCell>
            <TableCell style={{ textAlign: 'right' }}>Balance</TableCell>
            <TableCell style={{ textAlign: 'right' }}>
              Total (<span style={{ color: '#c9201f' }}>sent</span>/<span style={{ color: '#32c48d' }}>received</span>)
            </TableCell>
            <TableCell style={{ textAlign: 'right' }}>Uncashed Amount</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(accounting).map(([peer, values]) => (
            <TableRow key={peer}>
              <TableCell>{peer}</TableCell>
              <TableCell
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace, monospace',
                }}
              >
                <span style={{ color: values.balance > 0 ? '#32c48d' : '#c9201f' }}>
                  {fromBZZbaseUnit(values.balance).toFixed(7)}
                </span>{' '}
                BZZ
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace, monospace',
                }}
              >
                <span style={{ color: '#c9201f' }}>-{fromBZZbaseUnit(values.sent).toFixed(7)}</span>/
                <span style={{ color: '#32c48d' }}>{fromBZZbaseUnit(values.received).toFixed(7)}</span> BZZ
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'right',
                  fontFamily: 'monospace, monospace',
                }}
              >
                <span style={{ color: values.uncashedAmount > 0 ? '#32c48d' : 'rgba(0, 0, 0, 0.87)' }}>
                  {fromBZZbaseUnit(values.uncashedAmount).toFixed(7)}
                </span>{' '}
                BZZ
              </TableCell>
              <TableCell>
                {values.uncashedAmount > 0 && (
                  <CashoutModal amount={fromBZZbaseUnit(values.uncashedAmount).toFixed(7)} peerId={peer} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BalancesTable
