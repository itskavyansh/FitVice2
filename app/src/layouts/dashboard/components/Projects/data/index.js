/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// @mui material components
import Tooltip from '@mui/material/Tooltip';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAvatar from 'components/MDAvatar';
import MDProgress from 'components/MDProgress';

// Images
import logoXD from 'assets/images/small-logos/logo-xd.svg';
import logoAtlassian from 'assets/images/small-logos/logo-atlassian.svg';
import logoSlack from 'assets/images/small-logos/logo-slack.svg';
import logoSpotify from 'assets/images/small-logos/logo-spotify.svg';
import logoJira from 'assets/images/small-logos/logo-jira.svg';
import logoInvesion from 'assets/images/small-logos/logo-invision.svg';
import team1 from 'assets/images/team-1.jpg';
import team2 from 'assets/images/team-2.jpg';
import team3 from 'assets/images/team-3.jpg';
import team4 from 'assets/images/team-4.jpg';

export default function data() {
  const avatars = (members) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placeholder="bottom">
        <MDAvatar
          src={image}
          alt="name"
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: 'pointer',
            position: 'relative',

            '&:not(:first-of-type)': {
              ml: -1.25,
            },

            '&:hover, &:focus': {
              zIndex: '10',
            },
          }}
        />
      </Tooltip>
    ));

  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: 'class', accessor: 'class', width: '45%', align: 'left' },
      { Header: 'instructor', accessor: 'instructor', width: '10%', align: 'left' },
      { Header: 'duration', accessor: 'duration', align: 'center' },
      { Header: 'progress', accessor: 'progress', align: 'center' },
    ],

    rows: [
      {
        class: <Company image={logoXD} name="Morning Yoga Flow" />,
        instructor: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team1, 'Sarah Johnson'],
              [team2, 'Mike Chen'],
            ])}
          </MDBox>
        ),
        duration: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            60 min
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={80} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        class: <Company image={logoAtlassian} name="HIIT Workout" />,
        instructor: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team2, 'Mike Chen'],
              [team4, 'Emma Wilson'],
            ])}
          </MDBox>
        ),
        duration: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            45 min
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={60} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        class: <Company image={logoSlack} name="Meditation & Mindfulness" />,
        instructor: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team1, 'Sarah Johnson'],
              [team3, 'David Lee'],
            ])}
          </MDBox>
        ),
        duration: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            30 min
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={100} color="success" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        class: <Company image={logoSpotify} name="Strength Training" />,
        instructor: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team4, 'Emma Wilson'],
              [team3, 'David Lee'],
              [team2, 'Mike Chen'],
              [team1, 'Sarah Johnson'],
            ])}
          </MDBox>
        ),
        duration: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            90 min
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={75} color="success" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        class: <Company image={logoJira} name="Pilates Core" />,
        instructor: (
          <MDBox display="flex" py={1}>
            {avatars([[team4, 'Emma Wilson']])}
          </MDBox>
        ),
        duration: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            45 min
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={40} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        class: <Company image={logoInvesion} name="Cardio Blast" />,
        instructor: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team1, 'Sarah Johnson'],
              [team4, 'Emma Wilson'],
            ])}
          </MDBox>
        ),
        duration: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            60 min
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={50} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
    ],
  };
}
