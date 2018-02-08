const config = require("../_config");
const table = require("../plugins/_table");



exports.insertTaskListToPage = function(finishedArr) {
  var imageLogo = document.getElementById('main-logo');
  imageLogo.src = config.vars.kottansRoom.avatar;
  document.querySelector('#myInput').addEventListener('input', table.myFunction);

  console.log(finishedArr)
  var html = '';

  var divTable = document.getElementById('myTable');

  html += 
    `<tr class="header">
        <th onclick="${table.sortTable(1)}" style="width:5%;">Name</th>
        <th onclick="${table.sortTable(2)}" style="width:5%;">Nick</th>
        <th onclick="${table.sortTable(3)}" style="width:5%;">Published</th>
        <th style="width:80%;">Text</th>
    </tr>`;
        
  for (var i = 0; i < finishedArr.length; i++) {
    html += 
        `<tr>
          <td><img src="${finishedArr[i].avatarUrl}" class="user-icon">${finishedArr[i].displayName}</td>
          <td>(<a target="_blank" href="https://github.com${finishedArr[i].url}">${finishedArr[i].username}</a>)</td>
          <td>${finishedArr[i].sent}</td>
          <td>${finishedArr[i].text} </td>
        </tr>`;
  }
  divTable.innerHTML = html;
}