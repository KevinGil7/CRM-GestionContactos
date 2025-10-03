'use client'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid'
import { Outlet } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigation } from '../configs/navigation';
import UseJwtAuth from '@auth/services/Jwt/UseJwtAuth';



type LayoutProps = {
  children?: React.ReactNode;
  hideSidebar?: boolean;
} 

const userNavigation = [
  // { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children, hideSidebar = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = UseJwtAuth();

  const handleSignOut = () => {
    signOut?.();
    navigate('/');
  };

  const isCurrent = (href: string) => location.pathname === href;

useEffect(() => {
  const storedNombre = localStorage.getItem("user_username");
  const storedRoles = localStorage.getItem("user_roles");
  const storedToken = localStorage.getItem("jwt_access_token");
  
  console.log('Layout useEffect - storedNombre:', storedNombre);
  console.log('Layout useEffect - storedRoles:', storedRoles);
  console.log('Layout useEffect - storedToken:', storedToken ? 'Token exists' : 'No token');
  
  // Si no hay roles pero hay token, intentar decodificar el token
  if (!storedRoles && storedToken) {
    try {
      const tokenParts = storedToken.split('.');
      if (tokenParts.length === 3) {
        const payload = tokenParts[1];
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = atob(paddedPayload);
        const payloadObj = JSON.parse(decodedPayload);
        const rolesFromToken = payloadObj['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ['Administrator'];
        console.log('Layout useEffect - Decoded roles from token:', rolesFromToken);
        
        // Guardar los roles en localStorage
        localStorage.setItem('user_roles', JSON.stringify(rolesFromToken));
        const selectedRole = rolesFromToken.includes("Administrator") ? "Administrator" : rolesFromToken[0];
        setRol(selectedRole);
        console.log('Layout useEffect - Set rol from token:', selectedRole);
      }
    } catch (error) {
      console.error('Layout useEffect - Error decoding token:', error);
    }
  }
  
  if (storedNombre) setNombre(storedNombre);
  if (storedRoles) {
    try {
      const rolesArray = JSON.parse(storedRoles);
      console.log('Layout useEffect - rolesArray:', rolesArray);
      
      // Priorizar Administrator si está presente, sino tomar el primer rol
      let selectedRole = "User";
      if (rolesArray.includes("Administrator")) {
        selectedRole = "Administrator";
      } else if (rolesArray.length > 0) {
        selectedRole = rolesArray[0];
      }
      
      console.log('Layout useEffect - setting rol to:', selectedRole);
      setRol(selectedRole);
    } catch (error) {
      console.error('Layout useEffect - error parsing roles:', error);
      setRol("User");
    }
  } else {
    console.log('Layout useEffect - no storedRoles found, setting default User');
    setRol("User");
  }
}, []);

 return (
  <div className="h-full">
    {/* Mobile sidebar - Solo se muestra si hideSidebar es false */}
    {!hideSidebar && (
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src='/img/Logo_F.png'
                  className="h-30 w-auto mt-8"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation
                        .filter((item) => {
                          console.log('Mobile - Checking item:', item.name, 'user rol:', rol, 'item roles:', item.roles, 'includes result:', item.roles.includes(rol!));
                          return item.roles.includes(rol!);
                        })
                        .map((item) => (
                          <li key={item.name}>
                            {item.children ? (
                              <details className="group">
                                <summary
                                  className={classNames(
                                    'flex items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer'
                                  )}
                                >
                                  <item.icon className="size-6 shrink-0" />
                                  {item.name}
                                  <ChevronDownIcon className="ml-auto size-4 text-gray-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <ul className="pl-8 mt-1 space-y-1">
                                  {item.children.map((child) => (
                                    <li key={child.name}>
                                      <Link
                                        to={child.href}
                                        className={classNames(
                                          isCurrent(child.href)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                          'block rounded-md p-2 text-sm/6 font-medium'
                                        )}
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            ) : (
                              <Link to={item.href!}
                                className={classNames(
                                  isCurrent(item.href!)
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                )}
                              >
                                <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                {item.name}
                              </Link>
                            )}
                          </li>
                        ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    )}

    {/* Static sidebar for desktop - Solo se muestra si hideSidebar es false */}
    {!hideSidebar && (
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.filter((item) => {
                      console.log('Desktop - Checking item:', item.name, 'user rol:', rol, 'item roles:', item.roles, 'includes result:', item.roles.includes(rol!));
                      return item.roles.includes(rol!);
                    })
                    .map((item) => (
                      <li key={item.name}>
                        {item.children ? (
                          <details className="group">
                            <summary
                              className={classNames(
                                'flex items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer'
                              )}
                            >
                              <item.icon className="size-6 shrink-0" />
                              {item.name}
                              <ChevronDownIcon className="ml-auto size-4 text-gray-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <ul className="pl-8 mt-1 space-y-1">
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <Link
                                    to={child.href}
                                    className={classNames(
                                      isCurrent(child.href)
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                      'block rounded-md p-2 text-sm/6 font-medium'
                                    )}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : (
                          <Link to={item.href!}
                            className={classNames(
                              isCurrent(item.href!)
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                            )}
                          >
                            <item.icon aria-hidden="true" className="size-6 shrink-0" />
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )}

    {/* Main content area - Ajusta el padding izquierdo según hideSidebar */}
    <div className={classNames(
      hideSidebar ? 'lg:pl-0' : 'lg:pl-72',
      'h-full'
    )}>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Solo muestra el botón de abrir sidebar si hideSidebar es false */}
        {!hideSidebar && (
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        )}
        <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form action="#" method="GET" className="grid flex-1 grid-cols-1">
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">

            <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-0 hover:bg-gray-100 cursor-pointer p-2">
                <UserIcon className="w-8 h-8 text-gray-500" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{nombre}</p>
                  <p className="text-xs text-gray-500">{rol}</p>
                </div>
              </Menu.Button>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition"
              >
                {userNavigation.map((item) => (
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'flex items-center w-full px-3 py-1 text-sm text-gray-900 cursor-pointer p-2'
                        )}
                      >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      <main className="py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
)
}