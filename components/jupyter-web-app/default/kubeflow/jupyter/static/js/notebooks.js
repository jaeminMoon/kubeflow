namespace = ""

$(document).ready(function(){
  // Update the Notebooks when a Namespace is selected
  $("#ns-select").on("change", function() {
    namespace = this.value;
    updateNotebooksInNamespace(namespace);

    // Change the function for the CREATE NOTEBOOK button
    $("#create-nb-btn").click(_ => createNotebook(namespace))
  });

  // Search Bar
  $('#search-nb').bind("enterKey",function(e){
    namespace = this.value;
    updateNotebooksInNamespace(namespace);

    // Change the function for the CREATE NOTEBOOK button
    $("#create-nb-btn").click(_ => createNotebook(namespace))

    // In case user sees only default ns and we go to a ns with search bar
    // then the change listener won't be triggered
    $("#ns-select").val("")
  });

  $('#search-nb').keyup(function(e){
      if(e.keyCode == 13) {
        $(this).trigger("enterKey");
      }
  });

  // Get Notebooks for the ServiceAccount's Namespace
  var ns = new URL(window.location.href).searchParams.get("namespace")
  if (ns) {
    // Load the selected ns
    $("#ns-select").val(ns)
  }
  $("#ns-select").trigger("change");
});

function deleteNotebook(ns, nb) {
  $.getJSON(prefix + "/delete-notebook", { namespace:ns, notebook:nb}, function(data, status) {
    var innerHTML = ''
    if(data.success == true) {
      updateNotebooksInNamespace(ns)
    }
    else {
      innerHTML = `
      <div class="alert alert-warning">
        <span class="close" onclick="this.parentElement.style.display='none'">&times;</span>
        <strong>Warning!</strong><span class='warning-log'></span>
      </div>`
    }
    const $e = $("#error-msgs").html(innerHTML)
    $('.warning-log', $e).text(data.log)
  });
};

function connectNotebook(ns, nb) {
  window.open(`/notebook/${ns}/${nb}`, "_blank");
};

function createNotebook(ns) {
  // Redirect to Add Notebook URL
  window.location.href = `${prefix}/add-notebook?namespace=${ns}`
};

function updateNotebooksInNamespace(ns) {
  // Put the add Notebook button
  // $('#nb-table-body').html("");
  var tmp = $('<div>')
  
  // Get the Notebooks for selected Namespace
  $.getJSON(prefix + "/list-notebooks", { namespace:ns }, function(data, status) {
    // Remove data from table and errors
    $("#error-msgs").empty();
    // $('#nb-table-body').empty();

    if(data.success == true){
      // Create a row for every notebook
      for(var i=0; i < data.notebooks.length; i++) {

        var nb = data.notebooks[i];

        // Col 1: Notebook Status
        if (nb.status === 'Ready') {
          var stat = $("<i>").attr({
            class: "material-icons"
          }).text("done")
        } else {
          var stat = $("<p>").attr({
            class: "mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active"
          })
        }
        var col1 = $("<td>").attr({
          'id': 'status' + i,
        })
        .append(stat)
        
        $("<div>").attr({
          'class': "mdl-tooltip",
          'data-mdl-for': "status" + i,
        }).text(nb.status).appendTo('body')
        
        
        // Col 2: Notebook Name
        var col2 = $("<td>").text(nb.name)

        // Col 3: Notebook Namespace
        var col3 = $("<td>").text(ns)

        // Col 4: Notebook Namespace
        var col4 = $("<td>").attr({
          'id': 'image' + i,
        }).text(nb.image.split("/")[nb.image.split("/").length - 1])
        
        $("<div>").attr({
          'class': "mdl-tooltip",
          'data-mdl-for': "image" + i,
        }).text(nb.image).appendTo('body')
        

        // Col 5: Notebook CPU
        var col5 = $("<td>").text(nb.cpu)

        // Col 6: Notebook Memory
        var col6 = $("<td>").text(nb.mem)

        // Col 7: Notebook Volumes
        var col7 = $("<td>")

        var vols_actions_btn = $("<button>").attr({
          class: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon",
          id: 'vols'+i
        })

        var vols_btn_icon = $("<i>").attr({
          class: "material-icons"
        }).text("reorder")

        var vols_actions_menu = $("<ul>").attr({
          class: "mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right",
          for: 'vols'+i
        })

        if (nb.volumes.length === 0) {
          vols_actions_menu.append(
            $("<li>").attr({
              class: "mdl-menu__item",
              disabled: true,
            }).text('None')
          )
        } else {
          // Create an entry for each volume
          for(var j=0; j < nb.volumes.length; j++) {
            vols_actions_menu.append(
              $("<li>").attr({
                class: "mdl-menu__item",
              }).text(nb.volumes[j].name)
            )
          }
        }

        vols_actions_btn.append(vols_btn_icon)
        col7.append(vols_actions_btn)
        col7.append(vols_actions_menu)

        // Col 8: Notebook Options
        var col8 = $("<td>")

        var actions_btn = $("<button>").attr({
          class: "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon",
          id: 'menu'+i
        })

        var btn_icon = $("<i>").attr({
          class: "material-icons"
        }).text("more_vert")

        var actions_menu = $("<ul>").attr({
          class: "mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right",
          for: 'menu'+i
        })

        var connect = $("<li>").attr({
          class: "mdl-menu__item",
          onclick: 'connectNotebook(\''+ns+'\',\''+nb.name+'\')'
        }).text('Connect')

        var del = $("<li>").attr({
          class: "mdl-menu__item",
          onclick: 'deleteNotebook(\''+ns+'\',\''+nb.name+'\')'
        }).text('Delete')

        actions_btn.append(btn_icon)
        col8.append(actions_btn)
        actions_menu.append(connect)
        actions_menu.append(del)
        col8.append(actions_menu)

        // Create the row
        var new_row = $("<tr>")
          .append(col1)
          .append(col2)
          .append(col3)
          .append(col4)
          .append(col5)
          .append(col6)
          .append(col7)
          .append(col8)
        // $('#nb-table-body').append(new_row);
        tmp.append(new_row)
      }
      $('#nb-table-body').html(tmp.html())
    }
    else{
      innerHTML = `
      <div class="alert alert-warning">
        <span class="close" onclick="this.parentElement.style.display='none'">&times;</span>
        <strong>Warning!</strong><span class='warning-log'></span>
      </div>`

      const $e = $("#error-msgs").html(innerHTML)
      $('.warning-log', $e).text(data.log)
    }

    // Load the dynamic components of mdl
    // https://stackoverflow.com/a/34579828
    componentHandler.upgradeAllRegistered();

  });
}

function searchOut() {
  $("#ns-select").text("")
}
