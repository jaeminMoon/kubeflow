import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Volume, SnackType } from "src/app/utils/types";
import { Subscription } from "rxjs";
import { SnackBarService } from "src/app/services/snack-bar.service";

@Component({
  selector: "app-form-workspace-volume",
  templateUrl: "./form-workspace-volume.component.html",
  styleUrls: [
    "./form-workspace-volume.component.scss",
    "../resource-form.component.scss"
  ]
})
export class FormWorkspaceVolumeComponent implements OnInit {
  subscriptions = new Subscription();

  @Input() parentForm: FormGroup;
  @Input() readonly: boolean;
  @Input() pvcs: Volume[];
  @Input() storageClasses: string[];
  @Input() defaultStorageClass: boolean;

  constructor(private snackBar: SnackBarService) {}

  ngOnInit() {
    // Show a warning if no persistent storage is provided
    this.subscriptions.add(
      this.parentForm
        .get("noWorkspace")
        .valueChanges.subscribe((b: boolean) => {
          // close the snackbar if deselected
          if (!b) {
            this.snackBar.close();
          } else {
            const msg =
              "Your workspace will not be persistent. You will lose all " +
              "data in it, if your notebook is terminated for any reason.";
            this.snackBar.show(msg, SnackType.Warning, 0);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
