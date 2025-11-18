"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  FileText, 
  Users, 
  DollarSign, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Search,
  MessageCircle,
  Scale,
  BookOpen,
  Settings,
  Bell,
  ChevronRight,
  TrendingUp,
  Shield,
  Star,
  Gavel,
  ChevronDown
} from 'lucide-react';
import Header from '@/components/layout/header';
import { 
  getClientStats, 
  getRecentActivity,
  getUserConsultations
} from '@/lib/supabase';
import { signOut } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName: string;
  userType: string;
  city?: string;
}

interface ClientStats {
  totalConsultations: number;
  activeCases: number;
  walletBalance: number;
  totalSpent: number;
}

interface Activity {
  id: string;
  type: string;
  title?: string;
  status?: string;
  date: string;
  participant?: string;
  transactionType?: string;
  amount?: number;
  description?: string;
}

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 62 79" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
    <path d="M46.3782 0L30.7564 16.3146L36.1293 21.5024L42.6514 14.691V53.3941L6.77247 17.715C4.26262 15.2191 0 17.0044 0 20.5514V79H7.45364V28.9262L43.3326 64.6053C45.8423 67.1011 50.105 65.316 50.105 61.7689V14.691L56.6272 21.5024L62 16.3146L46.3782 0Z" fill="white"/>
  </svg>
);

const ClientDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ClientStats>({
    totalConsultations: 0,
    activeCases: 0,
    walletBalance: 0,
    totalSpent: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('[Dashboard] Checking Supabase Auth session...');
      
      // Import Supabase auth functions
      const { getSession, getUserProfile } = await import('@/lib/supabase-auth');
      
      // Check Supabase session
      const session = await getSession();
      
      if (!session || !session.user) {
        console.log('[Dashboard] No active session, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('[Dashboard] Session found, user ID:', session.user.id);
      
      // Fetch user profile from database
      const profile = await getUserProfile(session.user.id);
      
      if (!profile) {
        console.error('[Dashboard] Profile not found');
        router.push('/login');
        return;
      }
      
      console.log('[Dashboard] Profile fetched, user type:', profile.user_type);
      
      // Check user type
      if (profile.user_type !== 'client') {
        console.log('[Dashboard] User is not a client, redirecting to lawyer dashboard');
        router.push('/dashboard/lawyer');
        return;
      }
      
      // Set user data (convert to the expected format)
      setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        userType: profile.user_type,
        city: profile.city
      });
      
      // Fetch real data from Supabase
      const [clientStats, activity, userConsultations] = await Promise.all([
        getClientStats(profile.id),
        getRecentActivity(profile.id, 'client', 5),
        getUserConsultations(profile.id, 'client')
      ]);
      
      setStats(clientStats);
      setRecentActivity(activity);
      setConsultations(userConsultations);
      
    } catch (error) {
      console.error('[Dashboard] Error loading dashboard:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Header */}
      <Header hideAuthButtons={false} />

      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-br from-background via-background to-card border-b border-border/50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold text-foreground mb-4">
                Welcome back, <span className="text-primary">{user.fullName.split(' ')[0]}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl font-body">
                Your legal journey continues here. Access expert lawyers, manage your cases, and get the justice you deserve.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-body" asChild>
                  <Link href="/consult">
                    <Search className="mr-2 h-5 w-5" />
                    Find a Lawyer
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 font-body" asChild>
                  <Link href="/lawgpt">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Ask LawGPT
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full max-w-md lg:max-w-none lg:w-auto">
              <div className="w-full sm:w-96 h-44 sm:h-64 relative mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-3xl blur-2xl"></div>
                <Image
                  src="/images/landingpagephoto.png"
                  alt="Legal Services"
                  fill
                  className="object-cover rounded-2xl border border-border/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto no-scrollbar">
            <TabsList className="inline-flex space-x-2 items-center py-2 px-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="cases">My Cases</TabsTrigger>
              <TabsTrigger value="lawyers">Find Lawyers</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Modern Welcome Banner */}
            <Card className="border-0 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
              </div>
              <CardHeader className="relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="w-full sm:max-w-[70%]">
                    <CardTitle className="text-2xl sm:text-3xl lg:text-3xl font-headline font-semibold mb-2">
                      Welcome back, {user.fullName}!
                    </CardTitle>
                    <p className="text-base sm:text-lg text-primary-foreground/90 max-w-2xl font-body">
                      Your legal matters are in good hands. Here's what's happening with your account and explore new legal services.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Client Portal
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-body">
                    <Star className="mr-2 h-4 w-4" />
                    Rate Your Experience
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-body">
                    <Bell className="mr-2 h-4 w-4" />
                    Enable Notifications
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 font-body">Total Consultations</p>
                      <p className="text-3xl font-headline font-semibold text-foreground">{stats.totalConsultations}</p>
                      <p className="text-xs text-secondary mt-1 font-body">Lifetime bookings</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 font-body">Active Cases</p>
                      <p className="text-3xl font-headline font-semibold text-foreground">{stats.activeCases}</p>
                      <p className="text-xs text-secondary mt-1 font-body">Legal matters in progress</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link href="/dashboard/client/wallet" className="block">
                <Card className="border-border/50 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
                  </div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90 mb-1">Wallet Balance</p>
                        <p className="text-3xl font-headline font-semibold">₹{stats.walletBalance.toLocaleString('en-IN')}</p>
                        <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                          View wallet <ChevronRight className="w-3 h-3" />
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Spent</p>
                      <p className="text-3xl font-headline font-semibold text-foreground">₹{stats.totalSpent.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-secondary mt-1">On legal services</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modern Actions & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Quick Actions */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-headline">Quick Actions</CardTitle>
                  <p className="text-sm text-muted-foreground font-body">Get started with our legal services</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button size="lg" className="h-24 flex flex-col justify-center space-y-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-body" asChild>
                      <Link href="/consult">
                        <Search className="w-6 h-6" />
                        <span>Find a Lawyer</span>
                        <span className="text-xs opacity-80">Browse experts</span>
                      </Link>
                    </Button>
                    
                    <Button size="lg" variant="outline" className="h-24 flex flex-col justify-center space-y-2 border-secondary/50 text-secondary hover:bg-secondary/10 font-body" asChild>
                      <Link href="/lawgpt">
                        <MessageCircle className="w-6 h-6" />
                        <span>Ask LawGPT</span>
                        <span className="text-xs opacity-70">AI Legal Assistant</span>
                      </Link>
                    </Button>

                    <Button size="lg" variant="outline" className="h-24 flex flex-col justify-center space-y-2 border-primary/50 text-primary hover:bg-primary/10 font-body" asChild>
                      <Link href="/dashboard/client/wallet">
                        <DollarSign className="w-6 h-6" />
                        <span>My Wallet</span>
                        <span className="text-xs opacity-70">Manage funds</span>
                      </Link>
                    </Button>
                    
                    <Button size="lg" variant="outline" className="h-24 flex flex-col justify-center space-y-2 border-border/50 hover:bg-card font-body" onClick={() => setActiveTab('consultations')}>
                      <Calendar className="w-6 h-6" />
                      <span>Book Meeting</span>
                      <span className="text-xs opacity-70">Schedule consultation</span>
                    </Button>
                    
                    <Button size="lg" variant="outline" className="h-24 flex flex-col justify-center space-y-2 border-border/50 hover:bg-card font-body" onClick={() => setActiveTab('cases')}>
                      <FileText className="w-6 h-6" />
                      <span>My Cases</span>
                      <span className="text-xs opacity-70">View legal matters</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Recent Activity */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-headline">Recent Activity</CardTitle>
                  <p className="text-sm text-muted-foreground">Your latest legal interactions</p>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-headline font-semibold text-foreground mb-2">No Recent Activity</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm">Your consultations, case updates, and legal interactions will appear here</p>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('consultations')}>
                        Start Your Legal Journey
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-card/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'consultation' ? 'bg-primary/20' : 'bg-secondary/20'
                          }`}>
                            {activity.type === 'consultation' ? (
                              <Calendar className="w-5 h-5 text-primary" />
                            ) : (
                              <DollarSign className="w-5 h-5 text-secondary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">
                              {activity.type === 'consultation' ? activity.title : activity.description}
                            </p>
                            {activity.type === 'consultation' && activity.participant && (
                              <p className="text-sm text-muted-foreground">with {activity.participant}</p>
                            )}
                            {activity.type === 'transaction' && (
                              <p className="text-sm font-medium text-secondary">
                                {activity.transactionType === 'credit' ? '+' : '-'}₹{activity.amount}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.date).toLocaleDateString('en-IN', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge variant={activity.status === 'completed' || activity.status === 'success' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Featured Legal Services */}
            <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-headline">Legal Services</CardTitle>
                <p className="text-sm text-muted-foreground">Explore our comprehensive legal solutions</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group p-6 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-all duration-300 cursor-pointer">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <Scale className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-headline font-semibold mb-2">Civil Law</h3>
                    <p className="text-sm text-muted-foreground">Property disputes, contracts, and civil matters</p>
                  </div>
                  
                  <div className="group p-6 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-all duration-300 cursor-pointer">
                    <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                      <Shield className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-headline font-semibold mb-2">Criminal Law</h3>
                    <p className="text-sm text-muted-foreground">Criminal defense and legal protection</p>
                  </div>
                  
                  <div className="group p-6 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-all duration-300 cursor-pointer">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-headline font-semibold mb-2">Family Law</h3>
                    <p className="text-sm text-muted-foreground">Marriage, divorce, and family matters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-headline font-semibold">My Consultations</h2>
                <p className="text-muted-foreground">Manage your legal consultations and meetings</p>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
                <Link href="/consult">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book New Consultation
                </Link>
              </Button>
            </div>
            
            {consultations.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-headline font-semibold mb-4">No Consultations Yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">Start your legal journey by booking a consultation with our expert lawyers. Get personalized advice for your legal matters.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/consult">Find a Lawyer</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/lawgpt">Ask LawGPT First</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {consultations.map((consultation: any) => (
                  <Card key={consultation.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{consultation.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {consultation.lawyer?.full_name || 'Lawyer'}
                          </p>
                        </div>
                        <Badge variant={
                          consultation.status === 'completed' ? 'default' :
                          consultation.status === 'in_progress' ? 'secondary' :
                          'outline'
                        }>
                          {consultation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Scale className="w-4 h-4" />
                          <span>{consultation.legal_area}</span>
                        </div>
                        {consultation.scheduled_at && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(consultation.scheduled_at).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{consultation.fee}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Enhanced Cases Tab */}
          <TabsContent value="cases" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-headline font-semibold">My Legal Cases</h2>
                <p className="text-muted-foreground">Track and manage your ongoing legal matters</p>
              </div>
              <Button size="lg" variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10">
                <FileText className="mr-2 h-5 w-5" />
                Add New Case
              </Button>
            </div>
            
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-headline font-semibold mb-4">No Cases Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">Your legal cases will be organized and tracked here. Start by consulting with a lawyer to begin your legal journey.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline">
                  Learn About Case Management
                </Button>
                <Button size="lg" asChild>
                  <Link href="/consult">Find a Lawyer</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Find Lawyers Tab */}
          <TabsContent value="lawyers" className="space-y-6">
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-headline font-semibold mb-4">Find the Right Lawyer</h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto font-body">Browse through our network of verified, experienced lawyers. Filter by specialization, location, and ratings to find the perfect legal expert for your needs.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="font-body" asChild>
                  <Link href="/consult">Browse Lawyers</Link>
                </Button>
                <Button size="lg" variant="outline" className="font-body" asChild>
                  <Link href="/lawgpt">Get AI Recommendations</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline">Profile Information</CardTitle>
                    <p className="text-sm text-muted-foreground font-body">Manage your personal information and preferences</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="text-lg font-medium">{user.fullName}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <p className="text-lg font-medium">{user.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <p className="text-lg font-medium">{user.city || 'Not specified'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                          Client Account
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <Button size="lg">
                        <Settings className="mr-2 h-5 w-5" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="font-medium">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Consultations</span>
                      <span className="font-medium">{stats.totalConsultations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Cases</span>
                      <span className="font-medium">{stats.activeCases}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientDashboard;
