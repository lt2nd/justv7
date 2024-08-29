import { TextInput } from "react-native";


export default function CustomTextInput({ ...textInputProps }) {
    return (
        <TextInput
            {...textInputProps}
            className='border border-black-200 p-3 rounded-md '
        />
    )
}