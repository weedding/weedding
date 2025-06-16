import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/authSlice";

type Props = {}

const Admin = (props: Props) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.auth);

useEffect(() => {
 
  dispatch(authActions.getAllUsers());
}, [])

  return (
    <div className="admin-container">
      <h2>Admin</h2>
      <ol>
        {users &&
          [...users]
            .sort((a, b) => a.last_name.localeCompare(b.last_name)) // сортування за last_name
            .map((user) => (
              <li key={user.id} className={user.isConfirmed ? "confirmed" : ""}>
                {user.first_name} {user.last_name} — {user.isConfirmed ? "Confirmed" : "Not Confirmed"}
              </li>
            ))}
      </ol>


     
    
    </div>
  )
}

export default Admin