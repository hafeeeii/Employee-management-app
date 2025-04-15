import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import DesignationTab from "./tabs/designation"
import DepartmentTab from "./tabs/department"
import WorkLocationTab from "./tabs/work-location"
import Typography from "@/components/ui/typography"

const tabs = [
  {tab:'Designation', content: <DesignationTab/>},
  {tab:'Department', content: <DepartmentTab/>},
  {tab:'Work Location', content: <WorkLocationTab/>},
]
 const Settings = () => {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h5"> 
        Settings
      </Typography>
        <Tabs defaultValue={tabs[0].tab} >
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.tab} value={tab.tab}>
            {tab.tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.tab} value={tab.tab}>
          <Card>
            <CardContent className="py-2 min-h-[85vh]">
          {tab.content}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
    </div>
  )
}

export default Settings