function TableMessageRow({ colSpan, children }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-6 py-10 text-center text-med-text-muted"
      >
        {children}
      </td>
    </tr>
  );
}

export default TableMessageRow;
