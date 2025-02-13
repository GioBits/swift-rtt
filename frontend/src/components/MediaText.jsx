import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PropTypes from "prop-types";

const MediaText = ({title, response}) => {
  return (
    <div class="bg-orange-500 w-full h-1/2 border">
      <div class="h-[50px]">{title}</div>
      <div class="bg-cyan-500 w-full h-[calc(100%-100px)] p-4">
        {response}
      </div>
      <div class="h-[50px] flex flex-row">
        <div class="m-auto mr-5">
          <VolumeUpIcon/>
          <FileDownloadIcon sx={{ marginLeft: '10px'}}/>
        </div>
      </div>
    </div>
  )
}

export default MediaText

MediaText.propTypes = {
  title: PropTypes.node.isRequired,
  response: PropTypes.node.isRequired,
};