/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import WorkoutPlans from 'layouts/workout-plans';
import Consultancy from 'layouts/consultancy';
import NutritionGuide from 'layouts/nutrition';
import BMICalculator from 'layouts/bmi-calculator';
import PostureSense from 'layouts/posture-sense';
import TodoList from 'layouts/todo-list';
import MusclePedia from 'layouts/muscle-pedia';
import ExerciseDetails from 'layouts/muscle-pedia/exercise-details';
import Chatbot from 'layouts/chatbot';
import Landing from 'layouts/landing';
import AuthProfile from 'components/auth/Profile';
import Leaderboard from 'layouts/leaderboard';

// Auth components
import SignIn from 'components/auth/SignIn';
import SignUp from 'components/auth/SignUp';

// @mui icons
import Icon from '@mui/material/Icon';

const routes = [
  {
    type: 'collapse',
    name: 'Sign·In',
    key: 'signin',
    icon: <Icon fontSize="small">login</Icon>,
    route: '/signin',
    component: <SignIn />,
    noAuth: true,
    hideInNav: true,
  },
  {
    type: 'collapse',
    name: 'Sign·Up',
    key: 'signup',
    icon: <Icon fontSize="small">person_add</Icon>,
    route: '/signup',
    component: <SignUp />,
    noAuth: true,
    hideInNav: true,
  },
  {
    type: 'collapse',
    name: 'Landing',
    key: 'landing',
    icon: <Icon fontSize="small">home</Icon>,
    route: '/landing',
    component: <Landing />,
    noAuth: true,
    hideInNav: true,
  },
  {
    type: 'collapse',
    name: 'Dashboard',
    key: 'dashboard',
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: '/dashboard',
    component: <Dashboard />,
  },
  {
    type: 'collapse',
    name: 'Workout·Plans',
    key: 'workout-plans',
    icon: <Icon fontSize="small">fitness_center</Icon>,
    route: '/workout-plans',
    component: <WorkoutPlans />,
  },
  {
    type: 'collapse',
    name: 'PostureSense',
    key: 'posture-sense',
    icon: <Icon fontSize="small">accessibility_new</Icon>,
    route: '/posture-sense',
    component: <PostureSense />,
  },
  {
    type: 'collapse',
    name: 'MusclePedia',
    key: 'muscle-pedia',
    icon: <Icon fontSize="small">science</Icon>,
    route: '/muscle-pedia',
    component: <MusclePedia />,
  },
  {
    type: 'collapse',
    name: 'Consultancy',
    key: 'consultancy',
    icon: <Icon fontSize="small">self_improvement</Icon>,
    route: '/consultancy',
    component: <Consultancy />,
  },
  {
    type: 'collapse',
    name: 'Nutrition·&·Health',
    key: 'nutrition',
    icon: <Icon fontSize="small">restaurant_menu</Icon>,
    route: '/nutrition',
    component: <NutritionGuide />,
  },
  {
    type: 'collapse',
    name: 'BMI·Calculator',
    key: 'bmi-calculator',
    icon: <Icon fontSize="small">monitor_weight</Icon>,
    route: '/bmi-calculator',
    component: <BMICalculator />,
  },
  {
    type: 'collapse',
    name: 'ToDo·List',
    key: 'todo-list',
    icon: <Icon fontSize="small">checklist</Icon>,
    route: '/todo-list',
    component: <TodoList />,
  },
  {
    type: 'collapse',
    name: 'Leaderboard',
    key: 'leaderboard',
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: '/leaderboard',
    component: <Leaderboard />,
  },
  {
    type: 'collapse',
    name: 'MusclePedia Details',
    key: 'muscle-pedia-details',
    icon: <Icon fontSize="small">science</Icon>,
    route: '/muscle-pedia/:muscleName',
    component: <ExerciseDetails />,
    hideInNav: true,
  },
  {
    type: 'collapse',
    name: 'AI·Assistant',
    key: 'chatbot',
    icon: <Icon fontSize="small">smart_toy</Icon>,
    route: '/chatbot',
    component: <Chatbot />,
    hideInNav: true,
  },
];

export default routes;
