import WorkIcon from '@mui/icons-material/Work';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

/**
 *
 * @type {[{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string}]}
 */
const EmployerRoutes = [
  {
    title: "My Job Posts",
    link: "/job-posts",
    icon:<WorkIcon />
  },
  {
    title: "Create Job Post",
    link: "/new-job-post",
    icon: <CreateIcon />
  },
  {
    title: "Offers",
    link: "/offers",
    icon: <LocalOfferOutlinedIcon />
  },
  {
    title: "Profile",
    link: "/profile",
    icon: <AccountCircleIcon />
  }
]

/**
 *
 * @type {[{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string},{link: string, icon: JSX.Element, title: string}]}
 */
const EmployeeRoutes = [
  {
    title: "Job Search",
    link: "/",
    icon: <SearchIcon />
  },
  {
    title: "My Jobs",
    link: "/job-posts",
    icon:<BookmarksIcon />
  },
  {
    title: "My Applications",
    link: "/applications",
    icon: <DescriptionIcon />
  },
  {
    title: "Offers",
    link: "/offers",
    icon: <LocalOfferOutlinedIcon />
  },
  {
    title: "Profile",
    link: "/profile",
    icon: <AccountCircleIcon />
  },
]

export {EmployerRoutes, EmployeeRoutes}