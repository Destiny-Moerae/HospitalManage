import { combineReducers } from 'redux';
import global, { GlobalState } from './global';
import searchTable, { SearchTableState } from '../pages/search-table/redux/reducer';
import login, { UserLoginState } from '../pages/login/redux/reducer';

import department, { DepartmentsState } from '../pages/department/redux/reducer';
import surgery, { SurgeryState } from '../pages/surgery/redux/reducer';
import doctor, { DoctorState } from '../pages/doctor/redux/reducer';
import consult, { ConsultState } from '../pages/consult/redux/reducer';

export interface ReducerState {
  global: GlobalState;
  searchTable: SearchTableState;
  login: UserLoginState;

  department: DepartmentsState;
  surgery: SurgeryState;
  doctor: DoctorState;
  consult: ConsultState;
}

export default combineReducers({
  global,
  searchTable,
  login,

  department,
  surgery,
  doctor,
  consult,
});
