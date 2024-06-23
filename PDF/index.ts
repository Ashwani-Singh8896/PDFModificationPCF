
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { PDFDocument, rgb , StandardFonts} from 'pdf-lib';
import download from 'downloadjs'

//declare module 'downloadjs';



export class PDF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    private context: ComponentFramework.Context<IInputs> | undefined;
    private div:HTMLDivElement;
    private file:HTMLInputElement;
    private div2:HTMLDivElement;
    private btn:HTMLInputElement;

    
    // private x:number;
    // private y:number;
    
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
       
        this.context=context
        const text=context.parameters.Text.raw
        const x=context.parameters.X_Pos.raw
        const y=context.parameters.Y_Pos.raw
        const fontsize=context.parameters.FontSize.raw

        
        this.div=document.createElement("div");
        this.div.classList.add("main") ;
        // this.div.innerHTML=` <p>Click the button to modify an existing PDF document </p>
        // <input type="file" id="fileData" style="opacity:1;width:200px;height:15px" >
        // <div></div>
        // <button style="display:block" onclick="this.modifyPdf.bind(this)">Modify PDF</button>`
        this.file=document.createElement("input");
        this.file.setAttribute("id","fileData");
        this.file.type="file";
        this.file.style.opacity="1";
        this.file.style.width="200px";
        this.file.style.height="15px";
        this.file.style.pointerEvents="auto";
        this.div2=document.createElement("div");
        this.div2.classList.add("op");
        this.btn=document.createElement("input");
        this.btn.type="submit";
        this.btn.value="Modify PDF"

        
        this.div.appendChild(this.file);
        this.div2.appendChild(this.btn);
        container.appendChild(this.div);
        container.appendChild(this.div2);

        // this.file.addEventListener("change",this.handleFileChange.bind(this))
        this.modifyPdf = this.modifyPdf.bind(this);
        this.btn.addEventListener("click", (event)=>this.modifyPdf(event));
       

    }
    
    // public handleFileChange = () => {
    //     const fileInput :any= document.getElementById('fileData');
    //     const file:any = fileInput.files
    //     let selectedFile=file
        
      //};

     public async modifyPdf(event: Event) { 
        console.log("value",this);
        if(this.context){
            const x=this.context.parameters.X_Pos.raw
            const y=this.context.parameters.Y_Pos.raw
            const text=this.context.parameters.Text.raw
            const fontsize=this.context.parameters.FontSize.raw
        
        
        const fileInput= document.getElementById('fileData') as HTMLInputElement;
        
        // const file:any = fileInput.files
        // console.log(file);

        // if (file.length===0) {
        //     alert('Please select a PDF file.');
        //     return;
        //   }
        //   const fileReader = new FileReader();
        //   console.log(fileReader)
        //   fileReader.onload = async (event:any) => {
        //     console.log("Ashwani");
        //   const existingPdfBytes = new Uint8Array(event.target.result);
        //   console.log(existingPdfBytes);


       // fileInput.addEventListener('change', (event) => {
            //const file = (event.target as HTMLInputElement).files?.[0];
            const file=fileInput.files?.[0]
            console.log(file);

            if (!file) {
                    alert('Please select a PDF file.');
                    return;
            }
          
            if (file) {
              const fileReader = new FileReader();
              console.log(fileReader);
          
              fileReader.onload = async (event: any) => {
              const existingPdfBytes = new Uint8Array(event.target.result);
              console.log(existingPdfBytes);
             
          
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
      
            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
            
            const pages = pdfDoc.getPages()
            const lastPage = pages[pages.length-1]
            const dime=lastPage.getSize();
            console.log(dime)
      
            const { width, height } = lastPage.getSize()
      
            
            lastPage.drawText(String(text), {
               x: Number(x),
               y: Number(y), 
               color: rgb(0, 0, 0),
               font:timesRomanFont,
               size:Number(fontsize)
            })
          
            console.log("modified text",text);
            console.log("modified x",x);
            console.log("modified y",y);
            console.log("modified fontsize",fontsize)
            const pdfBytes = await pdfDoc.save()
            console.log(pdfBytes)
          
                  
            download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
          }
          fileReader.readAsArrayBuffer(file);

        }
        
       // })
    } 
     }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        // if(context.parameters.X.raw){
        //     this.x=context.parameters.X.raw
        // }
        // if(context.parameters.Y.raw){
        //     this.y=context.parameters.Y.raw
        // }
        const text=context.parameters.Text.raw
        const x=context.parameters.X_Pos.raw
        const y=context.parameters.Y_Pos.raw
        const fontsize=context.parameters.FontSize.raw
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
