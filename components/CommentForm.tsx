import { FC, useState } from "react";
import { useRouter } from "next/router";
import useMe from "../hooks";
import {
  Button,
  Flex,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { HiOutlineAnnotation } from "react-icons/hi";
import { createComment } from "../lib/createCommentFetcher";
import { mutate } from "swr";
import { CheckIcon } from "@chakra-ui/icons";
const CommentForm: FC<{ id: number }> = ({ id }) => {
  const [text, settext] = useState("");
  const { userObj, isError, isLoading } = useMe();
  const toast = useToast();
  const color = useColorModeValue("white", "gray.700");
  const [loading, setLoading] = useState(false);
  return (
    <Flex align={"center"} justify={"center"} py={6}>
      <Stack
        w={600}
        boxShadow={"2xl"}
        bg={color}
        rounded="xl"
        padding={5}
        spacing={2}
        align="center"
      >
        <HiOutlineAnnotation size={30} />
        <Stack align={"center"} spacing={2}>
          <Text fontSize={"lg"} color="gray.500">
            Throw a comment
          </Text>
        </Stack>
        <Stack
          direction={"row"}
          w={"full"}
          as="form"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              await createComment("comment/create", { pid: id, text });
              setLoading(false);
              toast({
                status: "success",
                position: "top",
                isClosable: true,
                colorScheme: "orange",
                title: <CheckIcon />,
                description: "🚀 Nice",
              });
              const response = await mutate("comment/getAllByPostId");
              console.log(response);
            } catch (error: any) {
              setLoading(false);
              console.log(error);
              toast({
                status: "error",
              });
            }
          }}
        >
          <Input
            value={text}
            onChange={(e) => settext(e.target.value)}
            type="text"
            rounded={"full"}
            bg={useColorModeValue("gray.100", "gray.600")}
            placeholder={"write your comment here !"}
            border={0}
            _focus={{
              bg: useColorModeValue("gray.200", "gray.800"),
              outline: "none",
            }}
          />
          <Button
            type="submit"
            bg={"blue.400"}
            rounded={"full"}
            color="white"
            flex={"auto"}
            _hover={{ bg: "blue.500" }}
            _focus={{ bg: "blue.500" }}
            disabled={text.length == 0}
            isLoading={loading}
          >
            Post
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default CommentForm;
