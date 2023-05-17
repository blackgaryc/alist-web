import copy from "copy-to-clipboard"
import { createResource } from "solid-js"
import { getHideFiles, objStore } from "~/store"
import { Obj } from "~/types"
import { fetchText, notify, pathJoin } from "~/utils"
import { useT, useLink, useRouter } from "."
import xlsx from "json-as-xlsx"

export const useUtil = () => {
  const t = useT()
  const { pathname } = useRouter()
  return {
    copy: (text: string) => {
      copy(text)
      notify.success(t("global.copied"))
    },
    isHide: (obj: Obj) => {
      const hideFiles = getHideFiles()
      for (const reg of hideFiles) {
        if (reg.test(pathJoin(pathname(), obj.name))) {
          return true
        }
      }
      return false
    },
    excel: (data) => {
      let settings = {
        fileName: "export_" + Date.now(), // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
      }
      xlsx(data, settings)
    },
  }
}

export const useFetchText = () => {
  const { proxyLink } = useLink()
  const fetchContent = async () => {
    return fetchText(proxyLink(objStore.obj, true))
  }
  return createResource("", fetchContent)
}
