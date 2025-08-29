'use client'
import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Smartphone,
    HelpCircle,
    ChevronRight,
    Moon,
    Sun,
    Eye,
    EyeOff,
    Volume2,
    VolumeX,
    Wifi,
    Battery,
    Download,
    Trash2,
    Info,
    MessageCircle,
    BookOpen,
    AlertTriangle,
    LucideIcon
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';


interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    size?: 'small' | 'default';
}

interface SettingItemProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    onClick?: () => void;
    showArrow?: boolean;
}

interface SettingSectionProps {
    title: string;
    children: React.ReactNode;
}

const SettingsScreen: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<boolean>(true);
    const [privacy, setPrivacy] = useState<boolean>(true);
    const [sound, setSound] = useState<boolean>(true);
    const [autoDownload, setAutoDownload] = useState<boolean>(false);

    const router = useRouter();

    const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, size = 'default' }) => {
        const sizeClasses = size === 'small' ? 'w-10 h-5' : 'w-12 h-6';
        const thumbSizeClasses = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

        return (
            <button
                onClick={() => onChange(!enabled)}
                className={`${sizeClasses} relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`${thumbSizeClasses} inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                />
            </button>
        );
    };

    const SettingItem: React.FC<SettingItemProps> = ({
        icon: Icon,
        title,
        subtitle,
        action,
        onClick,
        showArrow = false
    }) => (
        <div
            className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {action}
                {showArrow && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
        </div>
    );

    const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
        <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                {title}
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 ">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

                    <Breadcrumb className='mt-4'>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/overview">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Settings</BreadcrumbLink>
                            </BreadcrumbItem>

                        </BreadcrumbList>
                    </Breadcrumb>

                </div>

            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left Column */}
                    <div className="space-y-6">

                        {/* Account Section */}
                        {/* <SettingSection title="Account">
                            <SettingItem
                                icon={User}
                                title="Profile"
                                subtitle="Manage your personal information"
                                showArrow={true}
                                onClick={() => console.log('Navigate to profile')}
                            />
                            <SettingItem
                                icon={Shield}
                                title="Privacy & Security"
                                subtitle="Control your privacy settings"
                                showArrow={true}
                                onClick={() => console.log('Navigate to privacy')}
                            />
                        </SettingSection> */}

                        {/* Preferences Section */}
                        {/* <SettingSection title="Preferences">
                            <SettingItem
                                icon={darkMode ? Moon : Sun}
                                title="Dark Mode"
                                subtitle="Toggle dark theme"
                                action={
                                    <ToggleSwitch
                                        enabled={darkMode}
                                        onChange={setDarkMode}
                                    />
                                }
                            />
                            <SettingItem
                                icon={Bell}
                                title="Notifications"
                                subtitle="Push notifications and alerts"
                                action={
                                    <ToggleSwitch
                                        enabled={notifications}
                                        onChange={setNotifications}
                                    />
                                }
                            />
                            <SettingItem
                                icon={sound ? Volume2 : VolumeX}
                                title="Sound"
                                subtitle="App sounds and vibrations"
                                action={
                                    <ToggleSwitch
                                        enabled={sound}
                                        onChange={setSound}
                                    />
                                }
                            />
                            <SettingItem
                                icon={Globe}
                                title="Language"
                                subtitle="English (US)"
                                showArrow={true}
                                onClick={() => console.log('Navigate to language')}
                            />
                        </SettingSection> */}

                        {/* Data & Storage */}
                        {/* <SettingSection title="Data & Storage">
                            <SettingItem
                                icon={Download}
                                title="Auto-download"
                                subtitle="Automatically download media"
                                action={
                                    <ToggleSwitch
                                        enabled={autoDownload}
                                        onChange={setAutoDownload}
                                    />
                                }
                            />
                            <SettingItem
                                icon={Wifi}
                                title="Data Usage"
                                subtitle="Monitor your data consumption"
                                showArrow={true}
                                onClick={() => console.log('Navigate to data usage')}
                            />
                        </SettingSection> */}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Device Section */}
                        {/* <SettingSection title="Device">
                            <SettingItem
                                icon={Smartphone}
                                title="Display"
                                subtitle="Brightness, font size, and more"
                                showArrow={true}
                                onClick={() => console.log('Navigate to display')}
                            />
                            <SettingItem
                                icon={Battery}
                                title="Battery"
                                subtitle="Battery usage and optimization"
                                showArrow={true}
                                onClick={() => console.log('Navigate to battery')}
                            />
                        </SettingSection> */}

                        {/* Support Section */}
                        <SettingSection title="Support & Information">
                            <SettingItem
                                icon={Info}
                                title="About Us"
                                subtitle="Learn more about our company"
                                showArrow={true}
                                onClick={() => {
                                    window.open('https://nuuhabeauty.com/pages/about-us', '_blank');
                                }}
                            />
                            {/* <SettingItem
                                icon={HelpCircle}
                                title="Help Center"
                                subtitle="FAQs and support articles"
                                showArrow={true}
                                onClick={() => console.log('Navigate to help center')}
                            />
                            <SettingItem
                                icon={MessageCircle}
                                title="Contact Support"
                                subtitle="Get help from our team"
                                showArrow={true}
                                onClick={() => console.log('Navigate to contact support')}
                            />

                            <SettingItem
                                icon={BookOpen}
                                title="Terms & Privacy"
                                subtitle="Legal information and policies"
                                showArrow={true}
                                onClick={() => console.log('Navigate to terms and privacy')}
                            /> */}
                        </SettingSection>

                        {/* Account Management */}
                        <SettingSection title="Account Management">
                            <SettingItem
                                icon={Trash2}
                                title="Delete Account"
                                subtitle="Permanently delete your account and data"
                                showArrow={true}
                                onClick={() => {
                                    router.push('/delete-account');
                                }}
                            />
                        </SettingSection>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;