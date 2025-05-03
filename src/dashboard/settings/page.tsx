import { SettingsLayout } from "@/dashboard/settings/components/settings-layout"
import { ProfileSettings } from "@/dashboard/settings/components/profile-settings"
import { SecuritySettings } from "@/dashboard/settings/components/security-settings"
import { NotificationsSettings } from "@/dashboard/settings/components/notifications-settings"
import { PreferencesSettings } from "@/dashboard/settings/components/preferences-settings"

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <ProfileSettings />
      <SecuritySettings />
      <NotificationsSettings />
      <PreferencesSettings />
    </SettingsLayout>
  )
}
