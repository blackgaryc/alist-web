import { Menu, MenuTrigger, MenuContent, MenuItem } from "@hope-ui/solid"
import { useT, useExcelExport } from "~/hooks"
import { CenterIcon } from "./Icon"

export const ExcelExport = () => {
  const t = useT()
  const {
    exportSelectedRawLink,
    exportSelectedPreviewPage,
    exportCurrentRawLink,
  } = useExcelExport()
  const colorScheme = "neutral"
  return (
    <Menu placement="top" offset={10}>
      <MenuTrigger as={CenterIcon} name="excel_export" />
      <MenuContent>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            exportSelectedPreviewPage()
          }}
        >
          {t("home.toolbar.preview_page")}
        </MenuItem>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            exportSelectedRawLink()
          }}
        >
          {t("home.toolbar.down_link")}
        </MenuItem>
        <MenuItem
          colorScheme={colorScheme}
          onSelect={() => {
            exportSelectedRawLink(true)
          }}
        >
          {t("home.toolbar.encode_down_link")}
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
