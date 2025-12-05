"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useActivePath } from "./use-active-path";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  LogOut,
  User,
  Gavel,
  BarChart3,
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  BellOff,
  MessageCircle,
  Menu,
  Search,
  Phone,
  Video,
  MoreVertical,
  FileText,
  ChevronDown,
  ChevronRight,
  Building2,
  FileCheck,
} from "lucide-react";
import { useMessages } from "@/lib/messages-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Services dropdown menu data structure
const servicesMenuData = {
  companyFormation: {
    title: "Company Formation",
    icon: Building2,
    items: [
      { name: "Partnership Firm", href: "/services/partnership" },
      { name: "Private Limited Company", href: "/services/private-limited" },
      { name: "One Person Company", href: "/services/opc" },
      { name: "Limited Liability Partnership", href: "/services/llp" },
    ],
  },
  registrationsLicenses: {
    title: "Registrations & Licenses",
    icon: FileCheck,
    items: [
      { name: "Gst Registration", href: "/services/gst-registration" },
      { name: "Annual Gst Return Filing", href: "/services/gst-return-filing" },
      { name: "Export Import Code", href: "/services/iec" },
    ],
  },
};

// Services Dropdown Component (Desktop)
const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = useActivePath();
  const closeTimeoutRef = useState<NodeJS.Timeout | null>(null)[0];

  const handleMouseEnter = () => {
    if (closeTimeoutRef) clearTimeout(closeTimeoutRef);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
      setActiveSubmenu(null);
    }, 300); // 300ms delay before closing
    closeTimeoutRef && clearTimeout(closeTimeoutRef);
    Object.assign(closeTimeoutRef || {}, timeout);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 hover:text-primary transition-colors font-medium",
          pathname.startsWith("/services") && "text-primary"
        )}
      >
        Services
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
          style={{ marginTop: '0' }}
        >
          <div className="w-64 bg-card border border-border/50 rounded-lg shadow-xl backdrop-blur-sm">
            <div className="p-2">
              {/* Company Formation */}
              <div
                className="relative"
                onMouseEnter={() => setActiveSubmenu("companyFormation")}
              >
                <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted cursor-pointer text-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{servicesMenuData.companyFormation.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>

                {/* Company Formation Submenu */}
                {activeSubmenu === "companyFormation" && (
                  <>
                    {/* Bridge element - wider and positioned to cover gap */}
                    <div className="absolute left-full top-0 w-3 h-full z-40" />
                    <div className="absolute left-full top-0 ml-1 w-64 bg-card border border-border/50 rounded-lg shadow-xl z-50 backdrop-blur-sm">
                      <div className="p-2">
                        {servicesMenuData.companyFormation.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Registrations & Licenses */}
              <div
                className="relative"
                onMouseEnter={() => setActiveSubmenu("registrationsLicenses")}
              >
                <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted cursor-pointer text-foreground">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    <span className="font-medium">{servicesMenuData.registrationsLicenses.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>

                {/* Registrations & Licenses Submenu */}
                {activeSubmenu === "registrationsLicenses" && (
                  <>
                    {/* Bridge element - wider and positioned to cover gap */}
                    <div className="absolute left-full top-0 w-3 h-full z-40" />
                    <div className="absolute left-full top-0 ml-1 w-72 bg-card border border-border/50 rounded-lg shadow-xl z-50 backdrop-blur-sm">
                      <div className="p-2">
                        {servicesMenuData.registrationsLicenses.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Services Menu Component
const MobileServicesMenu = ({ onClose }: { onClose: () => void }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Company Formation Section */}
      <div className="rounded-md overflow-hidden border border-border/30">
        <button
          onClick={() => toggleSection("companyFormation")}
          className="w-full flex items-center justify-between py-3 px-3 text-foreground hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-foreground/80" />
            <span className="font-medium">Company Formation</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              expandedSection === "companyFormation" && "rotate-180"
            )}
          />
        </button>
        {expandedSection === "companyFormation" && (
          <div className="bg-muted/30 px-3 pb-2">
            {servicesMenuData.companyFormation.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-3 text-sm text-foreground hover:text-primary"
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Registrations & Licenses Section */}
      <div className="rounded-md overflow-hidden border border-border/30">
        <button
          onClick={() => toggleSection("registrationsLicenses")}
          className="w-full flex items-center justify-between py-3 px-3 text-foreground hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-foreground/80" />
            <span className="font-medium">Registrations & Licenses</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              expandedSection === "registrationsLicenses" && "rotate-180"
            )}
          />
        </button>
        {expandedSection === "registrationsLicenses" && (
          <div className="bg-muted/30 px-3 pb-2 max-h-64 overflow-y-auto">
            {servicesMenuData.registrationsLicenses.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-3 text-sm text-foreground hover:text-primary"
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Logo = () => (
  <>
    {/* Black logo for Light Mode */}
    <svg
      width="30"
      height="39"
      viewBox="0 0 23 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="dark:hidden transition-all duration-300"
    >
      <path
        d="M17.2048 0L11.4096 6.19541L13.4028 8.16545L15.8223 5.57886V20.2762L2.51237 6.72721C1.58129 5.77941 0 6.45738 0 7.80434V30H2.76506V10.9846L16.075 24.5337C17.006 25.4814 18.5874 24.8036 18.5874 23.4565V5.57886L21.0069 8.16545L23 6.19541L17.2048 0Z"
        fill="black"
      />
    </svg>
    {/* White logo for Dark Mode */}
    <svg
      width="30"
      height="39"
      viewBox="0 0 62 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden dark:block transition-all duration-300"
    >
      <path
        d="M46.3782 0L30.7564 16.3146L36.1293 21.5024L42.6514 14.691V53.3941L6.77247 17.715C4.26262 15.2191 0 17.0044 0 20.5514V79H7.45364V28.9262L43.3326 64.6053C45.8423 67.1011 50.105 65.316 50.105 61.7689V14.691L56.6272 21.5024L62 16.3146L46.3782 0Z"
        fill="white"
      />
    </svg>
  </>
);

// User dropdown for the main header
const HeaderUserDropdown = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) => {
  const dashboardLink =
    user.userType === "lawyer" ? "/dashboard/lawyer" : "/dashboard/client";
  const userTitle =
    user.userType === "lawyer" ? `Advocate ${user.fullName}` : user.fullName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              {user.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-card border-border/50"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm text-foreground">{userTitle}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          className="cursor-pointer text-foreground hover:bg-muted"
          asChild
        >
          <Link href={dashboardLink} className="flex items-center">
            {user.userType === "lawyer" ? (
              <Gavel className="mr-2 h-4 w-4" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            Dashboard
          </Link>
        </DropdownMenuItem>
        {user.userType === "lawyer" && (
          <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface HeaderProps {
  hideAuthButtons?: boolean;
  leftElement?: React.ReactNode;
}

// Notifications Popover Component
const NotificationsPopover = ({ user }: { user: any }) => {
  // Real-time notifications state - starts empty, will be populated by API calls
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Real-time notifications integration
  useEffect(() => {
    // TODO: Integrate with your real-time notification system
    // Examples:
    // 1. WebSocket connection for real-time updates
    // 2. Server-Sent Events (SSE)
    // 3. Polling API every few seconds
    // 4. Push notifications
    // Example implementation:
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await fetch(`/api/notifications/${user.id}`, {
    //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    //     });
    //     const data = await response.json();
    //     setNotifications(data.notifications);
    //   } catch (error) {
    //     console.error('Failed to fetch notifications:', error);
    //   }
    // };
    //
    // fetchNotifications();
    // const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    // return () => clearInterval(interval);
  }, [user.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Helper function for adding new notifications (for real-time integration)
  const addNotification = (notification: {
    id: number;
    type: "info" | "success" | "warning" | "error";
    title: string;
    message: string;
    time: string;
    read?: boolean;
  }) => {
    setNotifications((prev) => [
      { ...notification, read: notification.read || false },
      ...prev,
    ]);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative h-10 w-10 p-0 text-foreground hover:bg-muted transition-colors flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notifications popover */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border/50 rounded-lg shadow-lg z-50 backdrop-blur-sm">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BellOff className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    No notifications
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors cursor-pointer",
                        notification.read
                          ? "bg-muted/30 border-border/30"
                          : "bg-background border-border hover:bg-muted/50",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={cn(
                                "text-sm font-medium truncate",
                                notification.read
                                  ? "text-muted-foreground"
                                  : "text-foreground",
                              )}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              notification.read
                                ? "text-muted-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/50 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Chat Messages Icon Component (routes to /messages page)
const ChatMessagesIcon = ({ user }: { user: any }) => {
  const { getTotalUnread } = useMessages();
  const totalUnread = getTotalUnread();

  return (
    <Link href="/messages">
      <Button
        variant="ghost"
        size="sm"
        className="relative h-10 w-10 p-0 text-foreground hover:bg-muted transition-colors flex items-center justify-center"
      >
        <MessageCircle className="h-4 w-4" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-semibold animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </Button>
    </Link>
  );
};

const Header = ({ hideAuthButtons, leftElement }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check Supabase Auth session
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    try {
      const { getSession, getUserProfile } = await import('@/lib/supabase-auth');
      
      // Check for active Supabase session
      const session = await getSession();
      
      if (session && session.user) {
        console.log('[Header] Session found, fetching profile...');
        
        // Fetch user profile
        const profile = await getUserProfile(session.user.id);
        
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            userType: profile.user_type
          });
          console.log('[Header] User authenticated:', profile.user_type);
        }
      } else {
        console.log('[Header] No active session');
        setUser(null);
      }
    } catch (error) {
      console.error('[Header] Error checking auth:', error);
      setUser(null);
    }
  };

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      const { signOut } = await import('@/lib/supabase-auth');
      await signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error('[Header] Logout error:', error);
      // Force redirect even if there's an error
      setUser(null);
      window.location.href = "/";
    }
  };

  const pathname = useActivePath();
  return (
    <header
      id="home"
      className={cn(
        "fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300",
        "bg-background/80 dark:bg-background/80 backdrop-blur-sm",
        "border-b border-border/10",
        "relative",
      )}
    >
      {/* Absolutely position leftElement at extreme left if provided */}
      {leftElement && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 flex items-center z-50">
          {leftElement}
          <Link href="/" aria-label="Home" className="ml-24">
            <Logo />
          </Link>
        </div>
      )}
      <div className="container mx-auto px-6 grid grid-cols-3 items-center">
        {/* Always render a grid cell for layout consistency */}
        <div className="flex items-center group justify-self-start h-[40px]">
          {/* Only render logo in grid if leftElement is not provided */}
          {!leftElement && (
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
          )}
        </div>
        <nav className="hidden md:flex items-center justify-center gap-8 text-foreground text-sm font-body justify-self-center font-medium">
          <Link
            href="/consult"
            className={cn(
              "hover:text-primary transition-colors",
              pathname === "/consult" && "text-primary",
            )}
          >
            Consult
          </Link>
          <Link
            href="/lawgpt"
            className={cn(
              "hover:text-primary transition-colors",
              pathname === "/lawgpt" && "text-primary",
            )}
          >
            LawGPT
          </Link>
          <Link
            href="/documents"
            className={cn(
              "hover:text-primary transition-colors",
              pathname === "/documents" && "text-primary",
            )}
          >
            Document Drafting
          </Link>
          <ServicesDropdown />
        </nav>
        {/* Right side: auth actions + mobile menu button */}
        {!hideAuthButtons && !user && (
          <div className="hidden md:flex items-center gap-2 justify-self-end">
            <ThemeToggle />
            <Button
              variant="ghost"
              asChild
              className="text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-primary dark:bg-secondary hover:bg-primary/90 dark:hover:bg-secondary/90 text-primary-foreground px-6 transition-colors"
            >
              <Link href="/signup">Signup</Link>
            </Button>
          </div>
        )}
        {!hideAuthButtons && user && (
          <div className="hidden md:flex items-center gap-2 justify-self-end">
            {user.userType === "client" && <ChatMessagesIcon user={user} />}
            <NotificationsPopover user={user} />
            <ThemeToggle />
            <HeaderUserDropdown user={user} onLogout={handleLogout} />
          </div>
        )}

        {/* Mobile menu button - visible on small screens */}
        <div className="flex items-center ml-[200px]  md:hidden">
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="h-10 w-10 p-0 text-foreground hover:bg-muted flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0  z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-16 inset-x-0 bg-card border-t border-border/50 shadow-lg p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col gap-2">
              {/* Services Menu */}
              <div className="mb-2">
                <MobileServicesMenu onClose={() => setMobileMenuOpen(false)} />
              </div>

              <Link
                href="/consult"
                className={cn(
                  "flex items-center gap-3 py-3 px-3 rounded-md text-foreground hover:bg-muted",
                  pathname === "/consult" && "bg-muted",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Gavel className="w-5 h-5 text-foreground/80" />
                <span className="font-medium">Consult</span>
              </Link>

              <Link
                href="/lawgpt"
                className={cn(
                  "flex items-center gap-3 py-3 px-3 rounded-md text-foreground hover:bg-muted",
                  pathname === "/lawgpt" && "bg-muted",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5 text-foreground/80" />
                <span className="font-medium">LawGPT</span>
              </Link>

              <Link
                href="/documents"
                className={cn(
                  "flex items-center gap-3 py-3 px-3 rounded-md text-foreground hover:bg-muted",
                  pathname === "/documents" && "bg-muted",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-5 h-5 text-foreground/80" />
                <span className="font-medium">Document Drafting</span>
              </Link>

              {/* Chat & Notifications */}
              <Link
                href="/messages"
                className="flex items-center gap-3 py-3 px-3 rounded-md text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5 text-foreground/80" />
                <span className="font-medium">Messages</span>
              </Link>

              <Link
                href="/notifications"
                className="flex items-center gap-3 py-3 px-3 rounded-md text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="w-5 h-5 text-foreground/80" />
                <span className="font-medium">Notifications</span>
              </Link>
            </nav>

            <div className="mt-4 border-t border-border/40 pt-4 flex flex-col gap-3">
              {/* Theme Toggle for Mobile */}
              <div className="flex items-center justify-between py-3 px-4 rounded-md bg-muted/50">
                <span className="font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>

              {!user ? (
                <>
                  <Button asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-secondary text-white">
                    <Link href="/signup">Signup</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href={
                      user.userType === "lawyer"
                        ? "/dashboard/lawyer"
                        : "/dashboard/client"
                    }
                    className="py-3 px-4 rounded-md text-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Services Menu */}
            <div className="mt-4 border-t border-border/40 pt-4">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Services
              </h4>
              <MobileServicesMenu onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
