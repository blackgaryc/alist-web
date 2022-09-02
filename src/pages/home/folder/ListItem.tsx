import { Checkbox, HStack, Icon, Text, Tooltip } from "@hope-ui/solid";
import { Motion } from "@motionone/solid";
import { useContextMenu } from "solid-contextmenu";
import { batch, Show } from "solid-js";
import { LinkWithPush } from "~/components";
import { usePath, useUtil } from "~/hooks";
import {
  checkboxOpen,
  getIconColor,
  OrderBy,
  selectAll,
  selectIndex,
  toggleCheckbox,
} from "~/store";
import { ObjType, StoreObj } from "~/types";
import { bus, formatDate, getFileSize, hoverColor } from "~/utils";
import { getIconByObj } from "~/utils/icon";

export interface Col {
  name: OrderBy;
  textAlign: "left" | "right";
  w: any;
}

export const cols: Col[] = [
  { name: "name", textAlign: "left", w: { "@initial": "76%", "@md": "50%" } },
  { name: "size", textAlign: "right", w: { "@initial": "24%", "@md": "17%" } },
  { name: "modified", textAlign: "right", w: { "@initial": 0, "@md": "33%" } },
];

export const ListItem = (props: { obj: StoreObj; index: number }) => {
  const { isHide } = useUtil();
  if (isHide(props.obj)) {
    return null;
  }
  const { setPathAsDir } = usePath();
  const { show } = useContextMenu({ id: 1 });
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        width: "100%",
      }}
    >
      <HStack
        class="list-item"
        w="$full"
        p="$2"
        rounded="$lg"
        _hover={{
          transform: "scale(1.01)",
          bgColor: hoverColor(),
          transition: "all 0.3s",
        }}
        as={LinkWithPush}
        href={props.obj.name}
        onMouseEnter={() => {
          if (props.obj.is_dir) {
            setPathAsDir(props.obj.name, true);
          }
        }}
        onContextMenu={(e: MouseEvent) => {
          batch(() => {
            if (!checkboxOpen()) {
              toggleCheckbox();
            }
            selectAll(false);
            selectIndex(props.index, true, true);
          });
          show(e, { props: props.obj });
        }}
      >
        <HStack class="name-box" spacing="$1" w={cols[0].w}>
          <Show when={checkboxOpen()}>
            <Checkbox
              // colorScheme="neutral"
              // @ts-ignore
              on:click={(e) => {
                e.stopPropagation();
              }}
              checked={props.obj.selected}
              onChange={(e: any) => {
                selectIndex(props.index, e.target.checked);
              }}
            />
          </Show>
          <Icon
            class="icon"
            boxSize="$6"
            color={getIconColor()}
            as={getIconByObj(props.obj)}
            mr="$1"
            // @ts-ignore
            on:click={(e) => {
              if (props.obj.type === ObjType.IMAGE) {
                e.stopPropagation();
                e.preventDefault();
                bus.emit("gallery", props.obj.name);
              }
            }}
          />
          <Tooltip label={props.obj.name}>
            <Text
              class="name"
              css={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.obj.name}
            </Text>
          </Tooltip>
        </HStack>
        <Text class="size" w={cols[1].w} textAlign={cols[1].textAlign as any}>
          {getFileSize(props.obj.size)}
        </Text>
        <Text
          class="modified"
          display={{ "@initial": "none", "@md": "inline" }}
          w={cols[2].w}
          textAlign={cols[2].textAlign as any}
        >
          {formatDate(props.obj.modified)}
        </Text>
      </HStack>
    </Motion.div>
  );
};
