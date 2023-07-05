import { combineReducers } from 'redux';
import global, { GlobalState } from './global';
import searchTable, { SearchTableState } from '../pages/search-table/redux/reducer';
import categories, { CategoriesState } from '../pages/categories/redux/reducer';
import tags, { TagsState } from '../pages/tags/redux/reducer';
import login, { UserLoginState } from '../pages/login/redux/reducer';
import user, { UserState } from '../pages/user/redux/reducer';
import comment, { CommentState } from '../pages/comment/redux/reducer';
import recommend, { RecommendState } from '../pages/site/right/redux/reducer';
import articles, { ArticlesState } from '../pages/articles/redux/reducer';

import department, { DepartmentsState } from '../pages/department/redux/reducer';
import surgery, { SurgeryState } from '../pages/surgery/redux/reducer';
import doctor, { DoctorState } from '../pages/doctor/redux/reducer';
import consult, { ConsultState } from '../pages/consult/redux/reducer';

export interface ReducerState {
  global: GlobalState;
  searchTable: SearchTableState;
  login: UserLoginState;
  categories: CategoriesState;
  tags: TagsState;
  user: UserState;
  comment: CommentState;
  recommend: RecommendState;
  articles: ArticlesState;

  department: DepartmentsState;
  surgery: SurgeryState;
  doctor: DoctorState;
  consult: ConsultState;
}

export default combineReducers({
  global,
  searchTable,
  login,
  categories,
  tags,
  user,
  comment,
  recommend,
  articles,

  department,
  surgery,
  doctor,
  consult,
});
