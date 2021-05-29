const Import = ({ importData }) =>
  (<div>
    <label for="import-file" class="import-file">
        <i class="lni lni-syringe"></i> Import
    </label>
    <input id="import-file" type="file" accept=".json" onChange={(e) => importData(e.target.files[0])}/>
  </div>)


export default Import

