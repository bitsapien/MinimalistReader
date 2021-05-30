const Import = ({ importData }) =>
  (<div>
    <label htmlFor="import-file" className="import-file">
        <i className="lni lni-syringe"></i> Import
    </label>
    <input id="import-file" type="file" accept=".json" onChange={(e) => importData(e.target.files[0])}/>
  </div>)

export default Import
